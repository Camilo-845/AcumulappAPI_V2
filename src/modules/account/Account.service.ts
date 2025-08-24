import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ApiError } from "../../core";
import { ClientRepository } from "../client/Client.repository";
import { CollaboratorRepository } from "../collaborator/Collaborator.repository";
import { AccountRepository } from "./Account.repository";
import { BusinessRepository } from "../business/Business.repository";
import { AuthProviderRepository } from "../authProvider/AuthProvider.repository";
import { getDetailsByIdDTO, LoginRequestDTO } from "./DTO/Request";
import {
  AuthResponseDTO,
  ClientAuthResponseDTO,
  CollaboratorAuthResponseDTO,
} from "./DTO/Response";
import { comparePassword, hashPassword } from "../../utils/password";
import { signJwt, JWT_REFRESH_EXPIRES_IN, verifyJwt } from "../../utils/jwt";
import { LocalRegisterRequestDTO } from "./DTO/Request/localRegister.request.dto";
import { ICreateAccountData, IAccount } from "./Account.model";
import { getDetailsByEmailDTO } from "./DTO/Request/account.request.dto";
import {
  AccountDetailsResponseDTO,
  ClientAccountDetailsResponseDTO,
  CollaboratorAccountDetailsResponseDTO,
} from "./DTO/Response/accountDetails.response.dto";
import { JwtPayload } from "@clerk/types";

export class AccountService {
  private accountRepository: AccountRepository;
  private clientRepository: ClientRepository;
  private collaboratorRepository: CollaboratorRepository;
  private authProviderRepository: AuthProviderRepository;
  private businessRepository: BusinessRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.clientRepository = new ClientRepository();
    this.collaboratorRepository = new CollaboratorRepository();
    this.authProviderRepository = new AuthProviderRepository();
    this.businessRepository = new BusinessRepository();
  }

  public async clerkSignIn(
    clerkUserId: string,
    payload: any,
  ): Promise<AuthResponseDTO> {
    try {
      const email = payload.email;
      if (!email) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "El email no está disponible desde el proveedor.",
        );
      }

      let account =
        await this.accountRepository.findByProviderUserId(clerkUserId);

      if (!account) {
        account = await this.accountRepository.findByEmail(email);
        if (account && !account.providerUserId) {
          await this.accountRepository.update(account.id, {
            providerUserId: clerkUserId,
          });
        }
      }

      if (!account) {
        const googleAuthProvider =
          await this.authProviderRepository.findByName("google");
        if (!googleAuthProvider) {
          throw new Error('Proveedor de autenticación "google" no encontrado.');
        }

        const newAccountData: ICreateAccountData = {
          email,
          fullName:
            `${payload.firstName || ""} ${payload.lastName || ""}`.trim() ||
            email,
          providerUserId: clerkUserId,
          idAuthProvider: googleAuthProvider.id,
          emailVerified: true,
          profileImageURL: payload.imageUrl,
        };
        account = await this.accountRepository.create(newAccountData);
        await this.clientRepository.create({ idAccount: account.id });
      }

      if (!account) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "No se pudo obtener o crear el usuario.",
        );
      }

      const collaborators =
        await this.collaboratorRepository.findByAccountIdWithBusinessAndRole(
          account.id,
        );
      const isClient = await this.clientRepository.findByAccountId(account.id);

      let userType: "client" | "collaborator" | "none" = "none";
      if (isClient) userType = "client";
      if (collaborators && collaborators.length > 0) userType = "collaborator";

      if (userType === "none") {
        await this.clientRepository.create({ idAccount: account.id });
        userType = "client";
      }

      const jwtPayload = {
        id: account.id,
        email: account.email,
        userType: userType,
        collaboratorDetails: collaborators.map((c) => ({
          businessId: c.idBusiness,
          role: c.Roles.name,
        })),
      };

      const accessToken = signJwt(jwtPayload);
      const newRefreshToken = signJwt(jwtPayload, JWT_REFRESH_EXPIRES_IN);

      const hashedRefreshToken = await hashPassword(newRefreshToken);
      await this.accountRepository.update(account.id, {
        refreshToken: hashedRefreshToken,
      });

      if (userType === "client") {
        const response: ClientAuthResponseDTO = {
          token: accessToken,
          refreshToken: newRefreshToken,
          account: {
            id: account.id,
            email: account.email,
            fullName: account.fullName,
            userType: "client",
          },
        };
        return response;
      } else if (
        userType === "collaborator" &&
        collaborators &&
        collaborators.length > 0
      ) {
        const response: CollaboratorAuthResponseDTO = {
          token: accessToken,
          refreshToken: newRefreshToken,
          account: {
            id: account.id,
            email: account.email,
            fullName: account.fullName,
            userType: "collaborator",
            collaboratorDetails: collaborators.map((c) => ({
              businessId: c.idBusiness,
              businessName: c.Business.name || "N/A",
              role: c.Roles.name,
            })),
          },
        };
        return response;
      }

      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "No se pudo determinar el tipo de usuario para la sesión.",
      );
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      console.error("Clerk sign-in error:", error);
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Token de Clerk inválido o expirado.",
      );
    }
  }

  public async login(
    loginData: LoginRequestDTO,
    userType: "client" | "business",
  ): Promise<AuthResponseDTO> {
    const { email, password } = loginData;

    const account = await this.accountRepository.findByEmailWithPassword(email);
    if (!account || !account.password) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Credenciales inválidas.");
    }

    const isPasswordValid = await comparePassword(password, account.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Credenciales inválidas.");
    }

    if (userType === "client") {
      const isClient = await this.clientRepository.findByAccountId(account.id);
      if (!isClient) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `La cuenta no es un cliente.`,
        );
      }
    } else {
      const collaborators =
        await this.collaboratorRepository.findByAccountIdWithBusinessAndRole(
          account.id,
        );
      if (!collaborators || collaborators.length === 0) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `La cuenta no es un colaborador.`,
        );
      }
    }

    const collaborators =
      await this.collaboratorRepository.findByAccountIdWithBusinessAndRole(
        account.id,
      );

    let determinedUserType: "client" | "collaborator" | "none" = "none";
    if (userType === "client") determinedUserType = "client";
    if (userType === "business") determinedUserType = "collaborator";

    if (determinedUserType === "none") {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "La cuenta no está asociada a ningún tipo de usuario (cliente/colaborador).",
      );
    }

    const jwtPayload = {
      id: account.id,
      email: account.email,
      userType: determinedUserType,
      collaboratorDetails: collaborators.map((c) => ({
        businessId: c.idBusiness,
        role: c.Roles.name,
      })),
    };

    const token = signJwt(jwtPayload);
    const refreshToken = signJwt(jwtPayload, JWT_REFRESH_EXPIRES_IN);

    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.accountRepository.update(account.id, {
      refreshToken: hashedRefreshToken,
    });

    if (determinedUserType === "client") {
      const response: ClientAuthResponseDTO = {
        token,
        refreshToken,
        account: {
          id: account.id,
          email: account.email,
          fullName: account.fullName,
          userType: "client",
        },
      };
      return response;
    } else if (
      determinedUserType === "collaborator" &&
      collaborators &&
      collaborators.length > 0
    ) {
      const response: CollaboratorAuthResponseDTO = {
        token,
        refreshToken,
        account: {
          id: account.id,
          email: account.email,
          fullName: account.fullName,
          userType: "collaborator",
          collaboratorDetails: collaborators.map((c) => ({
            businessId: c.idBusiness,
            businessName: c.Business.name || "N/A",
            role: c.Roles.name,
          })),
        },
      };
      return response;
    }

    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "No se pudo determinar el tipo de usuario para la sesión.",
    );
  }

  public async registerClient(
    registerData: LocalRegisterRequestDTO,
  ): Promise<ClientAuthResponseDTO> {
    const existAccount = await this.accountRepository.findByEmail(
      registerData.email,
    );
    if (existAccount) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Ya existe una cuenta con este email.",
      );
    }

    const hashedPassword = await hashPassword(registerData.password);

    const localAuthProvider =
      await this.authProviderRepository.findByName("local");
    if (!localAuthProvider) {
      throw new Error('Proveedor de autenticación "local" no encontrado.');
    }

    const accountData: ICreateAccountData = {
      email: registerData.email,
      fullName: registerData.fullName,
      password: hashedPassword,
      idAuthProvider: localAuthProvider.id,
    };

    const newAccount = await this.accountRepository.create(accountData);

    await this.clientRepository.create({ idAccount: newAccount.id });

    const jwtPayload = {
      id: newAccount.id,
      email: newAccount.email,
      userType: "client" as const,
    };

    const token = signJwt(jwtPayload);
    const refreshToken = signJwt(jwtPayload, JWT_REFRESH_EXPIRES_IN);

    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.accountRepository.update(newAccount.id, {
      refreshToken: hashedRefreshToken,
    });

    const response: ClientAuthResponseDTO = {
      token,
      refreshToken,
      account: {
        id: newAccount.id,
        email: newAccount.email,
        fullName: newAccount.fullName,
        userType: "client",
      },
    };
    return response;
  }
  public async registerBusiness(
    registerData: LocalRegisterRequestDTO,
  ): Promise<CollaboratorAuthResponseDTO> {
    const existAccount = await this.accountRepository.findByEmail(
      registerData.email,
    );
    if (existAccount) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Ya existe una cuenta con este email.",
      );
    }

    const hashedPassword = await hashPassword(registerData.password);

    const localAuthProvider =
      await this.authProviderRepository.findByName("local");
    if (!localAuthProvider) {
      throw new Error('Proveedor de autenticación "local" no encontrado.');
    }

    const accountData: ICreateAccountData = {
      email: registerData.email,
      fullName: registerData.fullName,
      password: hashedPassword,
      idAuthProvider: localAuthProvider.id,
    };

    const newAccount = await this.accountRepository.create(accountData);

    const newBusiness = await this.businessRepository.create({});

    await this.collaboratorRepository.create({
      idAccount: newAccount.id,
      idBusiness: newBusiness.id,
      idRol: 1,
    });

    const jwtPayload = {
      id: newAccount.id,
      email: newAccount.email,
      userType: "collaborator" as const,
      collaboratorDetails: [
        {
          businessId: newBusiness.id,
          role: "Owner",
        },
      ],
    };

    const token = signJwt(jwtPayload);
    const refreshToken = signJwt(jwtPayload, JWT_REFRESH_EXPIRES_IN);

    const hashedRefreshToken = await hashPassword(refreshToken);
    await this.accountRepository.update(newAccount.id, {
      refreshToken: hashedRefreshToken,
    });

    const response: CollaboratorAuthResponseDTO = {
      token,
      refreshToken,
      account: {
        id: newAccount.id,
        email: newAccount.email,
        fullName: newAccount.fullName,
        userType: "collaborator",
        collaboratorDetails: [
          {
            businessId: newBusiness.id,
            businessName: newBusiness.name || "N/A",
            role: "Owner",
          },
        ],
      },
    };
    return response;
  }

  private async getAccountDetails(
    account: IAccount,
  ): Promise<AccountDetailsResponseDTO> {
    const collaborators =
      await this.collaboratorRepository.findByAccountIdWithBusinessAndRole(
        account.id,
      );

    if (collaborators && collaborators.length > 0) {
      const response: CollaboratorAccountDetailsResponseDTO = {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        userType: "collaborator",
        collaboratorDetails: collaborators.map((c) => ({
          businessId: c.idBusiness,
          businessName: c.Business.name || "N/A",
          role: c.Roles.name,
        })),
      };
      return response;
    }

    const isClient = await this.clientRepository.findByAccountId(account.id);
    if (isClient) {
      const response: ClientAccountDetailsResponseDTO = {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        userType: "client",
      };
      return response;
    }

    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "La cuenta no es ni cliente ni colaborador.",
    );
  }

  public async getAccountById(
    data: getDetailsByIdDTO,
  ): Promise<AccountDetailsResponseDTO> {
    const account = await this.accountRepository.findById(data.id);
    if (!account) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Cuenta no encontrada.");
    }
    return this.getAccountDetails(account);
  }
  public async getAccountByEmail(
    data: getDetailsByEmailDTO,
  ): Promise<AccountDetailsResponseDTO> {
    const account = await this.accountRepository.findByEmail(data.email);
    if (!account) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Cuenta no encontrada.");
    }
    return this.getAccountDetails(account);
  }

  public async refreshToken(
    token: string,
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      const payload = verifyJwt(token);

      const account = await this.accountRepository.findById(payload.id);
      if (!account || !account.refreshToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token.");
      }

      const isRefreshTokenValid = await comparePassword(
        token,
        account.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token.");
      }

      const collaborators =
        await this.collaboratorRepository.findByAccountIdWithBusinessAndRole(
          account.id,
        );
      const userType = collaborators.length > 0 ? "collaborator" : "client";

      const jwtPayload = {
        id: account.id,
        email: account.email,
        userType: userType,
        collaboratorDetails: collaborators.map((c) => ({
          businessId: c.idBusiness,
          role: c.Roles.name,
        })),
      };

      const newAccessToken = signJwt(jwtPayload);
      let newRefreshToken = token;

      if (typeof payload.exp === "undefined") {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Invalid token: No expiration date.",
        );
      }

      const tokenExp = payload.exp * 1000;
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      if (tokenExp < oneMonthFromNow.getTime()) {
        newRefreshToken = signJwt(jwtPayload, JWT_REFRESH_EXPIRES_IN);
        const hashedRefreshToken = await hashPassword(newRefreshToken);
        await this.accountRepository.update(account.id, {
          refreshToken: hashedRefreshToken,
        });
      }

      return { token: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "El token proporcionado es inválido o ha expirado.",
        );
      }
      throw error;
    }
  }
}
