import { z } from "zod";

export const getClientCardByClientRequestSchema = z.object({
  body: z.object({
    idClient: z.number().gt(0, "Debe ser mayor a 0"),
    idState: z.number().gt(0, "Debe ser mayor a 0").optional(),
  }),
});

export type GetClientCardByClientRequestDTO = z.infer<
  typeof getClientCardByClientRequestSchema
>["body"];

export const getClientCardByBusinessRequestSchema = z.object({
  body: z.object({
    idBusiness: z.number().gt(0, "Debe ser mayor a 0"),
    idState: z.number().gt(0, "Debe ser mayor a 0").optional(),
  }),
});

export type GetClientCardByBusinessRequestDTO = z.infer<
  typeof getClientCardByBusinessRequestSchema
>["body"];

export const addStampRequestSchema = z.object({
  body: z.object({
    stamps: z.number().gt(0, "Debe Ser menor a 0"),
  }),
});

export type AddStampRequestDTO = z.infer<typeof addStampRequestSchema>["body"];
