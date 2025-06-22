import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../core";
import { PaginationQueryParamsDTO } from "../../core/dtos/pagination.dto";
import { BusinessService } from "./Business.service";
import { Request, Response } from "express";

const businessService = new BusinessService();

export const getAllBusiness = asyncHandler(
  async (req: Request, res: Response) => {
    const queryParams = req.validatedData!.query as PaginationQueryParamsDTO;

    const paginationParams: PaginationQueryParamsDTO = {
      page: queryParams.page,
      size: queryParams.size,
    };
    const paginatedResponse =
      await businessService.getAllBusiness(paginationParams);

    return res.status(StatusCodes.OK).json(paginatedResponse);
  },
);
