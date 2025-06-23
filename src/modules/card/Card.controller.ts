import { Request, Response } from "express";
import { asyncHandler } from "../../core";
import { CreateCardRequestDTO } from "./DTO/Request/createCard.request.dto";
import { CardService } from "./Card.service";
import { StatusCodes } from "http-status-codes";
import { PaginationQueryParamsDTO } from "../../core/dtos/pagination.dto";

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
    const businessId = Number(req.params.id);
    const queryParams = req.validatedData!.query as PaginationQueryParamsDTO;

    const paginationParams: PaginationQueryParamsDTO = {
      page: queryParams.page,
      size: queryParams.size,
    };
    const paginatedResponse = await cardService.getAllCardsByBusiness(
      paginationParams,
      businessId,
    );
    return res.status(StatusCodes.OK).json(paginatedResponse);
  },
);
