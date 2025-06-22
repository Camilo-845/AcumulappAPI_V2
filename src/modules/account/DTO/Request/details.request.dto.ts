import { z } from "zod";

export const getDetailsById = z.object({
  params: z.object({
    id: z.coerce.number().int("El ID debe ser un número entero."),
  }),
});

export type getDetailsByIdDTO = z.infer<typeof getDetailsById>["params"];

export const getDetailsByEmail = z.object({
  body: z.object({
    email: z.string().email("Email inválido."),
  }),
});

export type getDetailsByEmailDTO = z.infer<typeof getDetailsByEmail>["body"];
