import { z } from "zod";

export const updateCardRequestSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100, "Less than 100").optional(),
    expiration: z.number().gt(0, "Debe ser mayor a 0").optional(),
    maxStamp: z
      .number()
      .gt(0, "Debe ser mayor a 0")
      .lt(50, "Debe ser menor de 50")
      .optional(),
    description: z
      .string()
      .min(1)
      .max(2000, "Descripcon debe tener menos de 2000 caaracteres")
      .optional(),
    restrictions: z.string().min(1).max(500, "less than 500").optional(),
    reward: z.string().min(1).max(500, "less than 500").optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export type UpdateCardRequestDTO = z.infer<
  typeof updateCardRequestSchema
>["body"];
export type UpdateCardRequestParamsDTO = z.infer<
  typeof updateCardRequestSchema
>["params"];
