import { environment } from "../../config/api";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../core";
import { generateAlphanumericCode } from "../../utils/uniqueCode";
import { ICreateClientCardData } from "./ClientCard.model";
import { ClientCardRepository } from "./ClientCard.repository";
import { CreateClientCardRequestDTO } from "./DTO/Request/createClientCard.request.dto";
import { PaginationQueryParamsDTO } from "../../core/dtos/pagination.dto";
import {
  GetClientCardsByBusinesRequestDTO,
  GetClientCardsByClientRequestDTO,
} from "./DTO/Request/getClientCardsFilters.request.dto";
import { buildPaginatedResponse } from "../../utils/pagination";
import { CardRepository } from "../card/Card.repository";

const baseUrl = `${environment.baseUrl}/api/v1/card`;

export class ClientCardService {
  private clientCardRepository: ClientCardRepository;
  private cardRepository: CardRepository;

  constructor() {
    this.clientCardRepository = new ClientCardRepository();
    this.cardRepository = new CardRepository();
  }

  public async createClientCard(data: CreateClientCardRequestDTO) {
    const CODE_LENGTH = 8;
    let uniqueCode: string = ""; // Initialize uniqueCode here to satisfy TypeScript
    let isUnique = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    // Bucle para generar un código único
    while (!isUnique && attempts < MAX_ATTEMPTS) {
      uniqueCode = generateAlphanumericCode(CODE_LENGTH);
      isUnique =
        !(await this.clientCardRepository.existsByUniqueCode(uniqueCode));
      attempts++;
      if (!isUnique) {
        console.warn(
          `Código '${uniqueCode}' ya existe. Intentando generar uno nuevo...`,
        );
      }
    }

    if (!isUnique) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "No se pudo generar un código único para la tarjeta del cliente.",
      );
    }

    const clientCard: ICreateClientCardData = {
      idClient: data.idClient,
      idCard: data.idCard,
      idCardState: 4,
      expirationDate: new Date(),
      currentStamps: 0,
      uniqueCode: uniqueCode, // This `uniqueCode` is now guaranteed to be assigned
    };

    return await this.clientCardRepository.create(clientCard);
  }

  public async getAllClientCardsByClientAndState(
    paginationParams: PaginationQueryParamsDTO,
    data: GetClientCardsByClientRequestDTO,
  ) {
    const { page, size } = paginationParams;
    const offset = (page - 1) * size;
    const limit = size;

    const { clientCards, total } =
      await this.clientCardRepository.findAllByClientAndState(
        {
          limit,
          offset,
        },
        data.idClient,
        data.idState ?? 1, // Por defecto estado activo
      );

    return buildPaginatedResponse(
      clientCards,
      total,
      paginationParams,
      baseUrl,
    );
  }
  public async getAllClientCardsByBusinessAndState(
    paginationParams: PaginationQueryParamsDTO,
    data: GetClientCardsByBusinesRequestDTO,
  ) {
    const { page, size } = paginationParams;
    const offset = (page - 1) * size;
    const limit = size;

    const { clientCards, total } =
      await this.clientCardRepository.fidAllByBusinessAndState(
        {
          limit,
          offset,
        },
        data.idBusiness,
        data.idState ?? 1, //Por defecto estado activo
      );

    return buildPaginatedResponse(
      clientCards,
      total,
      paginationParams,
      baseUrl,
    );
  }

  public async findById(id: number) {
    return await this.clientCardRepository.findById(id);
  }

  public async findByUniqueCode(uniqueCode: string) {
    return await this.clientCardRepository.findByUniqueCode(uniqueCode);
  }

  public async activateClientCard(uniqueCode: string) {
    const clientCard = await this.findByUniqueCode(uniqueCode);
    if (!clientCard) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Tarjeta de cliente no encontrada",
      );
    }
    const card = await this.cardRepository.findById(clientCard.idCard);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tarjeta no encontrada");
    }

    const durationInMinutes = card.expiration; // This is the duration in minutes from the Card model

    // --- Calculate the expirationDate ---
    const activationDate = new Date(); // Current time of activation
    const expirationDate = new Date(
      activationDate.getTime() + durationInMinutes * 60 * 1000,
    );

    const updatedClientCard = await this.clientCardRepository.update(
      clientCard.id,
      { idCardState: 1, expirationDate },
    );

    return updatedClientCard;
  }

  public async addStampsToClientCard(uniqueCode: string, stamps: number) {
    const clientCard = await this.findByUniqueCode(uniqueCode);
    if (!clientCard) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Tarjeta de cliente no encontrada",
      );
    }
    const card = await this.cardRepository.findById(clientCard.idCard);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Tarjeta no encontrada");
    }
    if (card.maxStamp < clientCard.currentStamps + stamps) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "No puedes añadir más sellos del maximo que permite la tarjeta",
      );
    }

    var statusId = 1;
    if (card.maxStamp == clientCard.currentStamps + stamps) {
      statusId = 2; // Cambia a estatus completada
    }
    const updatedClientCard = await this.clientCardRepository.update(
      clientCard.id,
      {
        currentStamps: clientCard.currentStamps + stamps,
        idCardState: statusId,
      },
    );

    return updatedClientCard;
  }

  public async markAsRedeemed(uniqueCode: string) {
    const clientCard = await this.findByUniqueCode(uniqueCode);
    if (!clientCard) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Tarjeta de cliente no encontrada",
      );
    }
    const updatedClientCard = await this.clientCardRepository.update(
      clientCard.id,
      {
        idCardState: 3,
        uniqueCode: null, // Marca el unique code como null ya que no lo va necesitar
      },
    );

    return updatedClientCard;
  }

  public async getBusinessStats(businessId: number) {
    const clientCards = await this.clientCardRepository.getStatsByBusiness(
      businessId,
    );

    if (clientCards.length === 0) {
      return {
        totalCards: 0,
        totalStamps: 0,
        cardStates: [],
      };
    }

    const totalCards = clientCards.length;
    const totalStamps = clientCards.reduce(
      (sum, card) => sum + card.currentStamps,
      0,
    );

    const cardStates = clientCards.reduce(
      (acc, card) => {
        const stateName = card.CardStates.name;
        if (!acc[stateName]) {
          acc[stateName] = { state: stateName, total: 0 };
        }
        acc[stateName].total++;
        return acc;
      },
      {} as Record<string, { state: string; total: number }>,
    );

    return {
      totalCards,
      totalStamps,
      cardStates: Object.values(cardStates),
    };
  }
}
