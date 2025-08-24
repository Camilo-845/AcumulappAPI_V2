import { environment } from "../../config/api";
import {
  PaginatedResponse,
  PaginationQueryParamsDTO,
} from "../../core/dtos/pagination.dto";
import { buildPaginatedResponse } from "../../utils/pagination";
import { ICard } from "./Card.model";
import { CardRepository } from "./Card.repository";
import { CreateCardRequestDTO } from "./DTO/Request/createCard.request.dto";
import { CardStateRepository } from "../cardState/CardState.repository";
import { ICardState } from "../cardState/CardState.model";

const baseUrl = `${environment.baseUrl}/api/v1/card`;

export class CardService {
  private cardRepository: CardRepository;
  private cardStateRepository: CardStateRepository;

  constructor() {
    this.cardRepository = new CardRepository();
    this.cardStateRepository = new CardStateRepository();
  }

  public async findById(id: number): Promise<ICard | null> {
    return await this.cardRepository.findById(id);
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
}

