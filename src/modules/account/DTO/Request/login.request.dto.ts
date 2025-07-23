import { z } from "zod";

export const loginRequestSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido.").min(1, "El email es requerido."),
    password: z.string().min(1, "La contraseña es requerida."),
  }),
});

export type LoginRequestDTO = z.infer<typeof loginRequestSchema>["body"];
