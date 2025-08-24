import { z } from "zod";

export const createRatingRequestSchema = z.object({
  body: z.object({
    idBusiness: z.coerce.number().int().positive(),
    valoration: z.coerce.number().int().min(1).max(5),
  }),
});

export type CreateRatingRequestDTO = z.infer<
  typeof createRatingRequestSchema
>["body"];
