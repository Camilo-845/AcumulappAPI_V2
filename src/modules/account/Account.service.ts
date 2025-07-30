import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../core";
import { ClientRepository } from "../client/Client.repository";
import { CollaboratorRepository } from "../collaborator/Collaborator.repository";
import { AccountRepository } from "./Account.repository";
import { BusinessRepository } from "../business/Business.repository";
import { AuthProviderRepository } from "../authProvider/AuthProvider.repository";
import { getDetailsByIdDTO, LoginRequestDTO } from "./DTO/Request";
import {
  AccountDetailsResponseDTO,
  AuthResponseDTO,
  ClientAuthResponseDTO,
  CollaboratorAuthResponseDTO,
} from "./DTO/Response";
import { comparePassword, hashPassword } from "../../utils/password";
import { signJwt } from "../../utils/jwt";
import { LocalRegisterRequestDTO } from "./DTO/Request/localRegister.request.dto";
import { ICreateAccountData } from "./Account.model";
import { getDetailsByEmailDTO } from "./DTO/Request/account.request.dto";

export class AccountService {
  getDetailsById(accountId: number) {
    throw new Error("Method not implemented.");
  }
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

  public async login(
    loginData: LoginRequestDTO,
    userType: "client" | "business",
  ): Promise<AuthResponseDTO> {
    const { email, password } = loginData;

    // 1. Encontrar la cuenta por email
    const account = await this.accountRepository.findByEmailWithPassword(email); // Necesitas un método que incluya el hash de password
    if (!account || !account.password) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Credenciales inválidas.");
    }

    // 2. Comparar la contraseña
    const isPasswordValid = await comparePassword(password, account.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Credenciales inválidas.");
    }

    // 3. Determinar el tipo de usuario y construir la respuesta
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

    // Lógica para deducir userType si no se envió explícitamente
    let determinedUserType: "client" | "collaborator" | "none" = "none";
    if (userType === "client") determinedUserType = "client";
    if (userType === "business") determinedUserType = "collaborator";

    if (determinedUserType === "none") {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "La cuenta no está asociada a ningún tipo de usuario (cliente/colaborador).",
      );
      userType;
    }

    // 4. Generar el payload del JWT
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

    // 5. Construir la respuesta basada en el tipo de usuario
    if (determinedUserType === "client") {
      const response: ClientAuthResponseDTO = {
        token,
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
        account: {
          id: account.id,
          email: account.email,
          fullName: account.fullName,
          userType: "collaborator",
          collaboratorDetails: collaborators.map((c) => ({
            businessId: c.idBusiness,
            businessName: c.Business.name || "N/A", // Asegúrate de cargar el nombre del negocio
            role: c.Roles.name, // Asegúrate de cargar el nombre del rol
          })),
        },
      };
      return response;
    }

    // En caso de que algo falle o no se encuentre el tipo
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

    //Crear el cliente asociado a la cuenta
    await this.clientRepository.create({ idAccount: newAccount.id });

    const jwtPayload = {
      id: newAccount.id,
      email: newAccount.email,
      userType: "client",
    };

    const token = signJwt(jwtPayload);

    const response: ClientAuthResponseDTO = {
      token,
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

    //Crear el negocio asociad
    const newBusiness = await this.businessRepository.create({});

    // Crear colaborador owner del negocio
    await this.collaboratorRepository.create({
      idAccount: newAccount.id,
      idBusiness: newBusiness.id,
      idRol: 1, // Asumiendo que el rol 1 es el de "owner"
    });

    const jwtPayload = {
      id: newAccount.id,
      email: newAccount.email,
      userType: "collaborator",
    };

    const token = signJwt(jwtPayload);

    const response: CollaboratorAuthResponseDTO = {
      token,
      account: {
        id: newAccount.id,
        email: newAccount.email,
        fullName: newAccount.fullName,
        userType: "collaborator",
        collaboratorDetails: [
          {
            businessId: newBusiness.id,
            businessName: newBusiness.name || "N/A",
            role: "owner",
          },
        ],
      },
    };
    return response;
  }

  public async getAccountById(
    data: getDetailsByIdDTO,
  ): Promise<AccountDetailsResponseDTO> {
    const account = await this.accountRepository.findById(data.id);
    if (!account) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Cuenta no encontrada.");
    }
    return {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      isActive: account.isActive,
      emailVerified: account.emailVerified,
      profileImageURL: account.profileImageURL || null,
    };
  }
  public async getAccountByEmail(
    data: getDetailsByEmailDTO,
  ): Promise<AccountDetailsResponseDTO> {
    const account = await this.accountRepository.findByEmail(data.email);
    if (!account) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Cuenta no encontrada.");
    }
    return {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
      isActive: account.isActive,
      emailVerified: account.emailVerified,
      profileImageURL: account.profileImageURL || null,
    };
  }
}
