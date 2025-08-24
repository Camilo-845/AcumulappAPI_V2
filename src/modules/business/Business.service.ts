import { ApiError } from "../../core";
import { environment } from "../../config/api";
import {
  PaginatedResponse,
  PaginationQueryParamsDTO,
} from "../../core/dtos/pagination.dto";
import { IBusinessCategory } from "../businessCategories/BusinessCategories.model";
import { BusinessCategoriesRepository } from "../businessCategories/BusinessCategories.repository";
import { IBusiness } from "./Business.model";
import { BusinessRepository } from "./Business.repository";
import { GetBusinessFiltersRequestDTO } from "./DTO/Request/getBusinessFilters.request.dto";
import { StatusCodes } from "http-status-codes";

export class BusinessService {
  private businessRepository: BusinessRepository;
  private businessCatefogoriesRepository: BusinessCategoriesRepository;

  constructor() {
    this.businessRepository = new BusinessRepository();
    this.businessCatefogoriesRepository = new BusinessCategoriesRepository();
  }

  public async getAllBusiness(
    paginationParams: PaginationQueryParamsDTO,
    filters: GetBusinessFiltersRequestDTO,
  ): Promise<PaginatedResponse<IBusiness>> {
    const { page, size } = paginationParams;
    const baseUrl = `${environment.baseUrl}/api/v1/business`;

    const offset = (page - 1) * size;
    const limit = size;

    const { business, total } = await this.businessRepository.findAllBusiness(
      {
        limit,
        offset,
      },
      filters,
    );

    const totalPages = Math.ceil(total / size);

    const getPageUrl = (p: number, s: number) => {
      const url = new URL(baseUrl);
      url.searchParams.set("page", p.toString());
      url.searchParams.set("size", s.toString());
      return url.toString();
    };

    return {
      data: business,
      pagination: {
        total_items: total,
        total_pages: totalPages,
        current_page: page,
        page_size: size,
        next_page: page < totalPages ? getPageUrl(page + 1, size) : null,
        prev_page: page > 1 ? getPageUrl(page - 1, size) : null,
        first_page: getPageUrl(1, size),
        last_page: getPageUrl(totalPages, size),
      },
    };
  }

  public async getAllCategories(): Promise<IBusinessCategory[]> {
    return await this.businessCatefogoriesRepository.findAll();
  }

  public async getBusinessById(id: number): Promise<IBusiness | null> {
    return await this.businessRepository.findByIdWithRelations(id);
  }

  public async completeBusinessProfile(
    id: number,
    data: {
      name?: string;
      description?: string;
      email?: string;
      logoImage?: string;
      bannerImage?: string;
      address?: string;
      location_latitude?: number;
      location_longitude?: number;
    },
  ): Promise<IBusiness | null> {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Negocio no encontrado.");
    }

    return await this.businessRepository.update(id, data);
  }

  public async updateBusinessCategories(
    id: number,
    categoryIds: number[],
  ): Promise<void> {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Negocio no encontrado.");
    }
    await this.businessRepository.updateBusinessCategories(id, categoryIds);
  }

  public async updateBusinessLinks(
    id: number,
    links: { idLink: number; value: string }[],
  ): Promise<void> {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Negocio no encontrado.");
    }
    await this.businessRepository.updateBusinessLinks(id, links);
  }

  public async markBusinessAsFavorite(
    businessId: number,
    clientId: number,
  ): Promise<void> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Negocio no encontrado.");
    }

    const isFavorite = await this.businessRepository.isBusinessFavorite(
      businessId,
      clientId,
    );
    if (isFavorite) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "El negocio ya está marcado como favorito.",
      );
    }

    await this.businessRepository.addFavoriteBusiness(businessId, clientId);
  }

  public async unmarkBusinessAsFavorite(
    businessId: number,
    clientId: number,
  ): Promise<void> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Negocio no encontrado.");
    }

    const isFavorite = await this.businessRepository.isBusinessFavorite(
      businessId,
      clientId,
    );
    if (!isFavorite) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "El negocio no está marcado como favorito.",
      );
    }

    await this.businessRepository.removeFavoriteBusiness(businessId, clientId);
  }

  public async checkIfBusinessIsFavorite(
    businessId: number,
    clientId: number,
  ): Promise<boolean> {
    const business = await this.businessRepository.findById(businessId);
    if (!business) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Negocio no encontrado.");
    }

    return await this.businessRepository.isBusinessFavorite(businessId, clientId);
  }

  public async getFavoriteBusiness(
    clientId: number,
    paginationParams: PaginationQueryParamsDTO,
    filters: GetBusinessFiltersRequestDTO,
  ): Promise<PaginatedResponse<IBusiness>> {
    const { page, size } = paginationParams;
    const baseUrl = `${environment.baseUrl}/api/v1/business/favorites`;

    const offset = (page - 1) * size;
    const limit = size;

    const { business, total } = await this.businessRepository.findFavoriteBusinessByClientId(
      clientId,
      { limit, offset },
      filters,
    );

    const totalPages = Math.ceil(total / size);

    const getPageUrl = (p: number, s: number) => {
      const url = new URL(baseUrl);
      url.searchParams.set("page", p.toString());
      url.searchParams.set("size", s.toString());
      return url.toString();
    };

    return {
      data: business,
      pagination: {
        total_items: total,
        total_pages: totalPages,
        current_page: page,
        page_size: size,
        next_page: page < totalPages ? getPageUrl(page + 1, size) : null,
        prev_page: page > 1 ? getPageUrl(page - 1, size) : null,
        first_page: getPageUrl(1, size),
        last_page: getPageUrl(totalPages, size),
      },
    };
  }
}
