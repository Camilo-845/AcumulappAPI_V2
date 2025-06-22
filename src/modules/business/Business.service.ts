import { environment } from "../../config/api";
import {
  PaginatedResponse,
  PaginationQueryParamsDTO,
} from "../../core/dtos/pagination.dto";
import { IBusiness } from "./Business.model";
import { BusinessRepository } from "./Business.repository";

export class BusinessService {
  private businessRepository: BusinessRepository;

  constructor() {
    this.businessRepository = new BusinessRepository();
  }

  public async getAllBusiness(
    paginationParams: PaginationQueryParamsDTO,
  ): Promise<PaginatedResponse<IBusiness>> {
    const { page, size } = paginationParams;
    const baseUrl = `${environment.baseUrl}/api/v1/business`;

    const offset = (page - 1) * size;
    const limit = size;

    const { business, total } = await this.businessRepository.findAllBusiness({
      limit,
      offset,
    });

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
