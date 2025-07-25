import { z } from "zod";

export const createCardRequestSchema = z.object({
  body: z.object({
    idBusiness: z.number().gt(0, "Debe ser mayor a 0"),
    expiration: z.number().gt(0, "Debe ser mayor a 0"),
    maxStamp: z
      .number()
      .gt(0, "Debe ser mayor a 0")
      .lt(50, "Debe ser menor de 50"),
    description: z
      .string()
      .min(1)
      .max(2000, "Descripcon debe tener menos de 2000 caaracteres"),
    restrictions: z.string().min(1).max(500, "less than 500"),
    reward: z.string().min(1).max(500, "less than 500"),
    name: z.string().min(1).max(100, "Less than 100"),
  }),
});

export type CreateCardRequestDTO = z.infer<
  typeof createCardRequestSchema
>["body"];
