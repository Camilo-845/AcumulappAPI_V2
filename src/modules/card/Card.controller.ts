import { Request, Response } from "express";
import { asyncHandler } from "../../core";
import { CreateCardRequestDTO } from "./DTO/Request/createCard.request.dto";
import { CardService } from "./Card.service";
import { StatusCodes } from "http-status-codes";
import { PaginationQueryParamsDTO } from "../../core/dtos/pagination.dto";
import {
  getDetailsByIdDTO,
  getDetailsByIdQueryDTO,
  getDetailsByIdQuerySchema,
} from "./DTO/Request/card.request.dto";

const cardService = new CardService();

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const cardData: CreateCardRequestDTO = req.body;
  const createdCard = await cardService.create(cardData);
  return res.status(StatusCodes.OK).json(createdCard);
});

export const getAllCards = asyncHandler(async (req: Request, res: Response) => {
  const queryParams = req.validatedData!.query as PaginationQueryParamsDTO;

  const paginationParams: PaginationQueryParamsDTO = {
    page: queryParams.page,
    size: queryParams.size,
  };
  const paginatedResponse = await cardService.getAllCards(paginationParams);
  return res.status(StatusCodes.OK).json(paginatedResponse);
});

export const getAllCardsByBusinessId = asyncHandler(
  async (req: Request, res: Response) => {
    const businessId = req.validatedData!.params as getDetailsByIdDTO;
    const queryParams = req.validatedData!.query as PaginationQueryParamsDTO &
      getDetailsByIdQueryDTO;

    const paginationParams: PaginationQueryParamsDTO = {
      page: queryParams.page,
      size: queryParams.size,
    };
    const paginatedResponse = await cardService.getAllCardsByBusiness(
      paginationParams,
      businessId.id,
      queryParams.isActive == undefined ? true : queryParams.isActive,
    );
    return res.status(StatusCodes.OK).json(paginatedResponse);
  },
);

export const getAllCardStates = asyncHandler(
  async (req: Request, res: Response) => {
    const cardStates = await cardService.getAllCardStates();
    return res.status(StatusCodes.OK).json(cardStates);
  },
);
