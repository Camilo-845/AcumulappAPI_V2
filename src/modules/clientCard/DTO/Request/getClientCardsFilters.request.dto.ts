import { z } from "zod";

export const getClientCardsByClientRequestSchema = z.object({
  body: z.object({
    idClient: z.number().gt(0, "Debe ser mayor a 0"),
    idState: z.number().gt(0, "debe ser mayor a 0").optional(),
  }),
});

export type GetClientCardsByClientRequestDTO = z.infer<
  typeof getClientCardsByClientRequestSchema
>["body"];

export const getClientCardsByBusinessRequestSchema = z.object({
  body: z.object({
    idBusiness: z.number().gt(0, "Debe ser mayor a 0"),
    idState: z.number().gt(0, "debe ser mayor a 0"),
  }),
});

export type GetClientCardsByBusinesRequestDTO = z.infer<
  typeof getClientCardsByBusinessRequestSchema
>["body"];
