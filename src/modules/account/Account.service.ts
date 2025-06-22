import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../core";
import { ClientRepository } from "../client/Client.repository";
import { CollaboratorRepository } from "../collaborator/Collaborator.repository";
import { AccountRepository } from "./Account.repository";
import { LoginRequestDTO } from "./DTO/Request";
import {
  AuthResponseDTO,
  ClientAuthResponseDTO,
  CollaboratorAuthResponseDTO,
} from "./DTO/Response";
import { comparePassword } from "../../utils/password";
import { signJwt } from "../../utils/jwt";

export class AccountService {
  private accountRepository: AccountRepository;
  private clientRepository: ClientRepository;
  private collaboratorRepository: CollaboratorRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.clientRepository = new ClientRepository();
    this.collaboratorRepository = new CollaboratorRepository();
  }

  public async login(loginData: LoginRequestDTO): Promise<AuthResponseDTO> {
    const { email, password, userType } = loginData;

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
    const isClient = await this.clientRepository.findByAccountId(account.id);
    const collaborators =
      await this.collaboratorRepository.findByAccountIdWithBusinessAndRole(
        account.id,
      );

    // Lógica para deducir userType si no se envió explícitamente
    let determinedUserType: "client" | "collaborator" | "none" = "none";
    if (isClient) determinedUserType = "client";
    if (collaborators && collaborators.length > 0)
      determinedUserType = "collaborator";

    if (
      userType &&
      userType !== determinedUserType &&
      determinedUserType !== "none"
    ) {
      // Si el userType solicitado no coincide con lo que encontramos
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `La cuenta no es un ${userType}.`,
      );
    }

    if (determinedUserType === "none") {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "La cuenta no está asociada a ningún tipo de usuario (cliente/colaborador).",
      );
    }

    // 4. Generar el payload del JWT
    // El payload debe contener solo la información necesaria para autenticar y autorizar futuras solicitudes
    const jwtPayload = {
      id: account.id,
      email: account.email,
      // No incluyas el password aquí
      userType: determinedUserType, // Añade el tipo de usuario al token
      // Si es colaborador, podrías incluir el roleId o businessId si es para un solo negocio
      // O puedes dejar que el middleware de autorización lo busque en la DB en cada request
    };

    const token = signJwt(jwtPayload);

    // 5. Construir la respuesta basada en el tipo de usuario
    if (determinedUserType === "client" && isClient) {
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
}
