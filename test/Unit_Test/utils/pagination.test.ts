
import { buildPaginatedResponse } from '@/utils/pagination';

describe('Pagination Utils', () => {
  const baseUrl = 'http://localhost:3000/api/v1/items';

  it('should build a paginated response for the first page', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const total = 10;
    const paginationParams = { page: 1, size: 3 };

    const result = buildPaginatedResponse(data, total, paginationParams, baseUrl);

    expect(result.data).toEqual(data);
    expect(result.pagination).toEqual({
      total_items: 10,
      total_pages: 4,
      current_page: 1,
      page_size: 3,
      next_page: `${baseUrl}?page=2&size=3`,
      prev_page: null,
      first_page: `${baseUrl}?page=1&size=3`,
      last_page: `${baseUrl}?page=4&size=3`,
    });
  });

  it('should build a paginated response for a middle page', () => {
    const data = [{ id: 4 }, { id: 5 }, { id: 6 }];
    const total = 10;
    const paginationParams = { page: 2, size: 3 };

    const result = buildPaginatedResponse(data, total, paginationParams, baseUrl);

    expect(result.data).toEqual(data);
    expect(result.pagination).toEqual({
      total_items: 10,
      total_pages: 4,
      current_page: 2,
      page_size: 3,
      next_page: `${baseUrl}?page=3&size=3`,
      prev_page: `${baseUrl}?page=1&size=3`,
      first_page: `${baseUrl}?page=1&size=3`,
      last_page: `${baseUrl}?page=4&size=3`,
    });
  });

  it('should build a paginated response for the last page', () => {
    const data = [{ id: 10 }];
    const total = 10;
    const paginationParams = { page: 4, size: 3 };

    const result = buildPaginatedResponse(data, total, paginationParams, baseUrl);

    expect(result.data).toEqual(data);
    expect(result.pagination).toEqual({
      total_items: 10,
      total_pages: 4,
      current_page: 4,
      page_size: 3,
      next_page: null,
      prev_page: `${baseUrl}?page=3&size=3`,
      first_page: `${baseUrl}?page=1&size=3`,
      last_page: `${baseUrl}?page=4&size=3`,
    });
  });

  it('should handle empty data and zero total items', () => {
    const data: any[] = [];
    const total = 0;
    const paginationParams = { page: 1, size: 10 };

    const result = buildPaginatedResponse(data, total, paginationParams, baseUrl);

    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({
      total_items: 0,
      total_pages: 0,
      current_page: 1,
      page_size: 10,
      next_page: null,
      prev_page: null,
      first_page: `${baseUrl}?page=1&size=10`,
      last_page: `${baseUrl}?page=0&size=10`,
    });
  });
});
