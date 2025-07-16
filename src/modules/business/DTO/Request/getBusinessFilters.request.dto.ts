import { z } from "zod";

export const getBusinessFiltersRequestSchema = z.object({
  query: z.object({
    name: z.string().min(1, "El nombre es invalido.").optional(),
    category: z.coerce.number().gt(0, "Debe ser mayor a 0").optional(),
  }),
});

export type GetBusinessFiltersRequestDTO = z.infer<
  typeof getBusinessFiltersRequestSchema
>["query"];
