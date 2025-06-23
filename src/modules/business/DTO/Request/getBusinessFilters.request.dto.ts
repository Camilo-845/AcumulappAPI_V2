import { z } from "zod";

export const getBusinessFiltersRequestSchema = z.object({
  body: z.object({
    name: z.string().min(1, "El nombre es invalido.").optional(),
    category: z.number().gt(0, "Debe ser mayor a 0").optional(),
  }),
});

export type GetBusinessFiltersRequestDTO = z.infer<
  typeof getBusinessFiltersRequestSchema
>["body"];
