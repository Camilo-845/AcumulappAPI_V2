import { z } from "zod";

export const updateBusinessCategoriesSchema = z.object({
  body: z.object({
    categories: z.array(z.number().int().positive("Cada ID de categoría debe ser un número entero positivo.")),
  }),
  params: z.object({
    id: z.coerce.number().int().positive("El ID del negocio debe ser un número entero positivo."),
  }),
});

export type UpdateBusinessCategoriesRequestDTO = z.infer<typeof updateBusinessCategoriesSchema>["body"];
export type UpdateBusinessCategoriesParamsDTO = z.infer<typeof updateBusinessCategoriesSchema>["params"];
