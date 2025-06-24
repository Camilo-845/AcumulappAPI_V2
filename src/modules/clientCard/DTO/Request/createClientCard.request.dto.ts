import { z } from "zod";

export const createClientCardRequestSchema = z.object({
  body: z.object({
    idClient: z.number().gt(0, "Debe ser mayor a 0"),
    idCard: z.number().gt(0, "Debe ser mayor a 0"),
    maxStamps: z.number().gt(0, "Debe ser mayor a 0"),
  }),
});

export type CreateClientCardRequestDTO = z.infer<
  typeof createClientCardRequestSchema
>["body"];
