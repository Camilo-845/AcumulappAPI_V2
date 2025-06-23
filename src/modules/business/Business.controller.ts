import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../core";
import { PaginationQueryParamsDTO } from "../../core/dtos/pagination.dto";
import { BusinessService } from "./Business.service";
import { Request, Response } from "express";
import { GetBusinessFiltersRequestDTO } from "./DTO/Request/getBusinessFilters.request.dto";

const businessService = new BusinessService();

export const getAllBusiness = asyncHandler(
  async (req: Request, res: Response) => {
    const queryParams = req.validatedData!.query as PaginationQueryParamsDTO;
    const filters: GetBusinessFiltersRequestDTO = req.body;

    const paginationParams: PaginationQueryParamsDTO = {
      page: queryParams.page,
      size: queryParams.size,
    };
    const paginatedResponse = await businessService.getAllBusiness(
      paginationParams,
      filters,
    );

    return res.status(StatusCodes.OK).json(paginatedResponse);
  },
);

export const getAllBusinessCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const businessCategories = await businessService.getAllCategories();
    return res.status(StatusCodes.OK).json(businessCategories);
  },
);
