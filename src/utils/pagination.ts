import {
  PaginatedResponse,
  PaginationQueryParamsDTO,
} from "../core/dtos/pagination.dto";

/**
 * Genera una respuesta paginada estándar para tus endpoints.
 * @param data Los elementos de datos de la página actual.
 * @param totalItems El número total de elementos disponibles (sin paginación).
 * @param paginationParams Los parámetros de paginación de la solicitud (page, size).
 * @param baseUrl La URL base del endpoint (ej. "http://localhost:8080/api/v1/cards").
 * @returns Un objeto PaginatedResponse con los datos y la información de paginación.
 */
export function buildPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  paginationParams: PaginationQueryParamsDTO,
  baseUrl: string, // La URL base del endpoint actual
): PaginatedResponse<T> {
  const { page, size } = paginationParams;

  const totalPages = Math.ceil(totalItems / size);

  // Función interna para construir las URLs de página
  const getPageUrl = (p: number) => {
    // Usamos URL para manejar correctamente los parámetros de consulta existentes
    const url = new URL(baseUrl);
    url.searchParams.set("page", p.toString());
    url.searchParams.set("size", size.toString());
    // Aquí podrías añadir lógica para mantener otros filtros si estuvieran en los searchParams
    // Por ejemplo, si los filtros se pasan como query params:
    // if (paginationParams.name) url.searchParams.set("name", paginationParams.name);
    // if (paginationParams.category) url.searchParams.set("category", paginationParams.category.toString());
    return url.toString();
  };

  return {
    data: data,
    pagination: {
      total_items: totalItems,
      total_pages: totalPages,
      current_page: page,
      page_size: size,
      next_page: page < totalPages ? getPageUrl(page + 1) : null,
      prev_page: page > 1 ? getPageUrl(page - 1) : null,
      first_page: getPageUrl(1),
      last_page: getPageUrl(totalPages),
    },
  };
}
