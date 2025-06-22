import { z } from "zod";

export const paginationQueryParams = z.object({
  page: z.coerce
    .number()
    .int("Page debe ser un número entero.")
    .min(1, "Page debe ser al menos 1.")
    .default(1),
  size: z.coerce
    .number()
    .int("Size debe ser un número entero.")
    .min(1, "Size debe ser al menos 1.")
    .max(50, "Size no puede ser mayor a 50.")
    .default(10),
});

export type PaginationQueryParamsDTO = z.infer<typeof paginationQueryParams>;

// --- Interfaces para la Respuesta Paginada ---

// Interfaz para los metadatos de paginación
export interface PaginationMetadata {
  total_items: number; // Total de elementos en la colección.
  total_pages: number; // Total de páginas disponibles.
  current_page: number; // Página actual.
  page_size: number; // Elementos por página en esta solicitud.
  next_page: string | null; // URL para la siguiente página (o null si no hay).
  prev_page: string | null; // URL para la página anterior (o null si no hay).
  first_page: string; // URL para la primera página.
  last_page: string; // URL para la última página.
}

// Interfaz genérica para la respuesta paginada
// T es un placeholder para el tipo de datos que se paginan (ej. IAccount, IBusiness)
export interface PaginatedResponse<T> {
  data: T[]; // Array de objetos de tu recurso
  pagination: PaginationMetadata; // Metadatos de paginación
}
