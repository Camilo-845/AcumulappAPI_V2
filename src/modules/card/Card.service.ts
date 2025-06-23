import { environment } from "../../config/api";
import {
  PaginatedResponse,
  PaginationQueryParamsDTO,
} from "../../core/dtos/pagination.dto";
import { buildPaginatedResponse } from "../../utils/pagination";
import { ICard } from "./Card.model";
import { CardRepository } from "./Card.repository";
import { CreateCardRequestDTO } from "./DTO/Request/createCard.request.dto";

const baseUrl = `${environment.baseUrl}/api/v1/card`;

export class CardService {
  private cardRepository: CardRepository;

  constructor() {
    this.cardRepository = new CardRepository();
  }

  public async create(cardData: CreateCardRequestDTO): Promise<ICard> {
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
    );

    return buildPaginatedResponse(cards, total, paginationParams, baseUrl);
  }
}
