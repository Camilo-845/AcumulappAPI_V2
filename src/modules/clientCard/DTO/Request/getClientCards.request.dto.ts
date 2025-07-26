import { z } from "zod";

export const getClientCardByClientRequestSchema = z.object({
  query: z.object({
    idClient: z.coerce.number().gt(0, "Debe ser mayor a 0"),
    idState: z.coerce.number().gt(0, "Debe ser mayor a 0").optional(),
  }),
});

export type GetClientCardByClientRequestDTO = z.infer<
  typeof getClientCardByClientRequestSchema
>["query"];

export const getClientCardByBusinessRequestSchema = z.object({
  query: z.object({
    idBusiness: z.coerce.number().gt(0, "Debe ser mayor a 0"),
    idState: z.coerce.number().gt(0, "Debe ser mayor a 0").optional(),
  }),
});

export type GetClientCardByBusinessRequestDTO = z.infer<
  typeof getClientCardByBusinessRequestSchema
>["query"];

export const addStampRequestSchema = z.object({
  body: z.object({
    stamps: z.number().gt(0, "Debe Ser menor a 0"),
  }),
});

export type AddStampRequestDTO = z.infer<typeof addStampRequestSchema>["body"];
