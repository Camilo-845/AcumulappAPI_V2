import { Request, Response } from "express";
import { asyncHandler } from "../../core";
import { ClientCardService } from "./ClientCard.service";
import { CreateClientCardRequestDTO } from "./DTO/Request/createClientCard.request.dto";
import { StatusCodes } from "http-status-codes";
import { PaginationQueryParamsDTO } from "../../core/dtos/pagination.dto";
import {
  AddStampRequestDTO,
  GetClientCardByBusinessRequestDTO,
  GetClientCardByClientRequestDTO,
} from "./DTO/Request/getClientCards.request.dto";

const clientCardService = new ClientCardService();

export const createClientCard = asyncHandler(
  async (req: Request, res: Response) => {
    const clientCardData: CreateClientCardRequestDTO = req.body;
    const createdClientCard =
      await clientCardService.createClientCard(clientCardData);
    return res.status(StatusCodes.OK).json(createdClientCard);
  },
);

export const getAllClientCardsByClient = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.validatedData!.query as GetClientCardByClientRequestDTO;
    const queryParams = req.validatedData!.query as PaginationQueryParamsDTO;
    const paginationParams: PaginationQueryParamsDTO = {
      page: queryParams.page,
      size: queryParams.size,
    };
    const paginatedResponse =
      await clientCardService.getAllClientCardsByClientAndState(
        paginationParams,
        { idClient: data.idClient, idState: data.idState ?? 1 },
      );
    return res.status(StatusCodes.OK).json(paginatedResponse);
  },
);
export const getAllClientCardsByBusiness = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.validatedData!.query as GetClientCardByBusinessRequestDTO;
    const queryParams = req.validatedData!.query as PaginationQueryParamsDTO;
    const paginationParams: PaginationQueryParamsDTO = {
      page: queryParams.page,
      size: queryParams.size,
    };
    const paginatedResponse =
      await clientCardService.getAllClientCardsByBusinessAndState(
        paginationParams,
        { idBusiness: data.idBusiness, idState: data.idState ?? 1 },
      );
    return res.status(StatusCodes.OK).json(paginatedResponse);
  },
);

export const findById = asyncHandler(async (req: Request, res: Response) => {
  const clientCardId = Number(req.params.id);
  const clientCard = await clientCardService.findById(clientCardId);
  return res.status(StatusCodes.OK).json(clientCard);
});

export const findByUniqueCode = asyncHandler(
  async (req: Request, res: Response) => {
    const uniqueCode = req.params.uniqueCode;
    const clientCard = await clientCardService.findByUniqueCode(uniqueCode);
    return res.status(StatusCodes.OK).json(clientCard);
  },
);

export const activateCard = asyncHandler(
  async (req: Request, res: Response) => {
    const uniqueCode = req.params.uniqueCode;
    const updatedClientCard =
      await clientCardService.activateClientCard(uniqueCode);
    return res.status(StatusCodes.OK).json(updatedClientCard);
  },
);

export const addStampToClientCard = asyncHandler(
  async (req: Request, res: Response) => {
    const uniqueCode = req.params.uniqueCode;
    const data: AddStampRequestDTO = req.body;
    const updatedClientCard = await clientCardService.addStampsToClientCard(
      uniqueCode,
      data.stamps,
    );
    return res.status(StatusCodes.OK).json(updatedClientCard);
  },
);

export const markClientCardAsRedeemed = asyncHandler(
  async (req: Request, res: Response) => {
    const uniqueCode = req.params.uniqueCode;
    const updatedClientCard =
      await clientCardService.markAsRedeemed(uniqueCode);
    return res.status(StatusCodes.OK).json(updatedClientCard);
  },
);

export const getBusinessStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { businessId } = req.validatedData!.query as { businessId: string };
    const stats = await clientCardService.getBusinessStats(Number(businessId));
    return res.status(StatusCodes.OK).json(stats);
  },
);
