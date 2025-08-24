import { StatusCodes } from "http-status-codes";
import { ApiError, asyncHandler } from "../../core";
import { PaginationQueryParamsDTO } from "../../core/dtos/pagination.dto";
import { BusinessService } from "./Business.service";
import { Request, Response } from "express";
import { GetBusinessFiltersRequestDTO } from "./DTO/Request/getBusinessFilters.request.dto";
import { UpdateBusinessLinksRequestDTO } from "./DTO/Request/updateBusinessLinks.request.dto";
import { BusinessIdParamDTO } from "./DTO/Request/businessId.request.dto";

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
      description?: string;
      email?: string;
      logoImage?: string;
      bannerImage?: string;
      address?: string;
      location_latitude?: number;
      location_longitude?: number;
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

export const updateBusinessLinks = asyncHandler(
  async (req: Request, res: Response) => {
    const businessId = Number(req.validatedData!.params!.id);
    const { links } = req.validatedData!.body as UpdateBusinessLinksRequestDTO;

    await businessService.updateBusinessLinks(businessId, links);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Links actualizados exitosamente." });
  },
);

export const markBusinessAsFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    const businessId = req.validatedData!.params as BusinessIdParamDTO;
    const clientId = req.user!.id;

    await businessService.markBusinessAsFavorite(
      businessId.businessId,
      clientId,
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: "Negocio marcado como favorito exitosamente." });
  },
);

export const unmarkBusinessAsFavorite = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    const businessId = req.validatedData!.params as BusinessIdParamDTO;
    const clientId = req.user!.id;

    await businessService.unmarkBusinessAsFavorite(
      businessId.businessId,
      clientId,
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: "Negocio desmarcado como favorito exitosamente." });
  },
);

export const isFavoriteBusiness = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    const businessId = req.validatedData!.params as BusinessIdParamDTO;
    const clientId = req.user!.id;

    const isFavorite = await businessService.checkIfBusinessIsFavorite(
      businessId.businessId,
      clientId,
    );

    return res.status(StatusCodes.OK).json({ isFavorite });
  },
);

export const getFavoriteBusiness = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }
    const clientId = req.user!.id;
    const queryParams = req.validatedData!.query as PaginationQueryParamsDTO;
    const filters = req.validatedData!.query as GetBusinessFiltersRequestDTO;
    const paginationParams: PaginationQueryParamsDTO = {
      page: queryParams.page,
      size: queryParams.size,
    };
    const paginatedResponse = await businessService.getFavoriteBusiness(
      clientId,
      paginationParams,
      filters,
    );

    return res.status(StatusCodes.OK).json(paginatedResponse);
  },
);
