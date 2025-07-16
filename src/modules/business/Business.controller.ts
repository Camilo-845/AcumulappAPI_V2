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
    const filters = req.validatedData!.query as GetBusinessFiltersRequestDTO;
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

export const getBusinessById = asyncHandler(
  async (req: Request, res: Response) => {
    const businessId = Number(req.params.id);
    const business = await businessService.getBusinessById(businessId);
    return res.status(StatusCodes.OK).json(business);
  },
);

export const completeBusinessProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const businessId = Number(req.validatedData!.params!.id);
    const updateData = req.validatedData!.body as {
      name?: string;
      email?: string;
      idLocation?: number;
      logoImage?: string;
      address?: string;
    };

    const updatedBusiness = await businessService.completeBusinessProfile(
      businessId,
      updateData,
    );

    return res.status(StatusCodes.OK).json(updatedBusiness);
  },
);

export const updateBusinessCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const businessId = Number(req.validatedData!.params!.id);
    const { categories } = req.validatedData!.body as {
      categories: number[];
    };

    await businessService.updateBusinessCategories(businessId, categories);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Categorías actualizadas exitosamente." });
  },
);
