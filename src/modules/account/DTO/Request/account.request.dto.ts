// En tu archivo de DTOs o esquemas Zod
import { z } from "zod";

export const getDetailsByEmailSchema = z.object({
  params: z.object({
    email: z.string().email("Invalid email address"), // Asegúrate de validar el formato del email
  }),
});

// Este tipo se inferirá directamente del esquema Zod,
// o puedes definirlo explícitamente si lo prefieres para claridad.
export type getDetailsByEmailDTO = z.infer<
  typeof getDetailsByEmailSchema
>["params"];

export const getDetailsByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().gt(0, "Invalid format"),
  }),
});

export const loginQuerySchema = z.object({
  query: z.object({
    userType: z.enum(["client", "business"]).optional().default("client"),
  }),
});

export type LoginQueryDTO = z.infer<typeof loginQuerySchema>["query"];

// Este tipo se inferirá directamente del esquema Zod,
// o puedes definirlo explícitamente si lo prefieres para claridad.
export type getDetailsByIdDTO = z.infer<typeof getDetailsByIdSchema>["params"];

