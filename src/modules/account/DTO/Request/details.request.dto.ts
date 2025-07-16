import { z } from "zod";

export const getDetailsById = z.object({
  params: z.object({
    id: z.coerce.number().int("El ID debe ser un número entero."),
  }),
});

export type getDetailsByIdDTO = z.infer<typeof getDetailsById>["params"];
