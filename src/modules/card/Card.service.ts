import { environment } from "../../config/api";
import {
  PaginatedResponse,
  PaginationQueryParamsDTO,
} from "../../core/dtos/pagination.dto";
import { buildPaginatedResponse } from "../../utils/pagination";
import { ICard, IUpdateCardData } from "./Card.model";
import { CardRepository } from "./Card.repository";
import { CreateCardRequestDTO } from "./DTO/Request/createCard.request.dto";
import { CardStateRepository } from "../cardState/CardState.repository";
import { SubscriptionService } from "../subscription/Subscription.service";
import { ICardState } from "../cardState/CardState.model";
import { ApiError } from "../../core";
import { StatusCodes } from "http-status-codes";

const baseUrl = `${environment.baseUrl}/api/v1/card`;

export class CardService {
  private cardRepository: CardRepository;
  private cardStateRepository: CardStateRepository;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.cardRepository = new CardRepository();
    this.cardStateRepository = new CardStateRepository();
    this.subscriptionService = new SubscriptionService();
  }

  public async findById(id: number): Promise<ICard | null> {
    return await this.cardRepository.findById(id);
  }

  public async create(cardData: CreateCardRequestDTO): Promise<ICard> {
    // Check active cards limit for free plan
    const { pagination: activeCardsCount } = await this.getAllCardsByBusiness(
      { page: 1, size: 1 }, // Only need count
      cardData.idBusiness,
      true, // isActive: true
    );

    if (activeCardsCount.total_items >= environment.freePlansOptions.maxCards) {
      const hasActiveSubscription = await this.subscriptionService.isBusinessSubscriptionActive(cardData.idBusiness);
      if (!hasActiveSubscription) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "El negocio ha alcanzado el límite de tarjetas activas para el plan gratuito. Se requiere una suscripción activa para crear más tarjetas.",
        );
      }
    }
    return await this.cardRepository.create(cardData);
  }

  public async getAllCards(
    paginationParams: PaginationQueryParamsDTO,
  ): Promise<PaginatedResponse<ICard>> {
    const { page, size } = paginationParams;

    const offset = (page - 1) * size;
    const limit = size;

    const { cards, total } = await this.cardRepository.findAllCards({
      limit,
      offset,
    });

    return buildPaginatedResponse(cards, total, paginationParams, baseUrl);
  }

  public async getAllCardsByBusiness(
    paginationParams: PaginationQueryParamsDTO,
    businessId: number,
    isActive: boolean,
  ): Promise<PaginatedResponse<ICard>> {
    const { page, size } = paginationParams;

    const offset = (page - 1) * size;
    const limit = size;

    const { cards, total } = await this.cardRepository.filAllCardsByBusiness(
      {
        limit,
        offset,
      },
      businessId,
      isActive,
    );

    return buildPaginatedResponse(cards, total, paginationParams, baseUrl);
  }

  public async getAllCardStates(): Promise<ICardState[]> {
    return await this.cardStateRepository.findAll();
  }

  public async updateCard(
    id: number,
    cardData: IUpdateCardData,
  ): Promise<ICard | null> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Card not found");
    }

    // If trying to activate the card and it was previously inactive
    if (cardData.isActive === true && card.isActive === false) {
      const { pagination: activeCardsCount } = await this.getAllCardsByBusiness(
        { page: 1, size: 1 }, // Only need count
        card.idBusiness,
        true, // isActive: true
      );

      if (activeCardsCount.total_items >= environment.freePlansOptions.maxCards) {
        const hasActiveSubscription = await this.subscriptionService.isBusinessSubscriptionActive(card.idBusiness);
        if (!hasActiveSubscription) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            "El negocio ha alcanzado el límite de tarjetas activas para el plan gratuito. Se requiere una suscripción activa para activar más tarjetas.",
          );
        }
      }
    }

    return await this.cardRepository.update(id, cardData);
  }
}
