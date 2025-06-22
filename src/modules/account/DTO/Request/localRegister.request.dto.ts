import { z } from "zod";

export const localRegisterRequestSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido.").min(1, "El email es requerido."),
    password: z.string().min(1, "La contraseña es requerida."),
    fullName: z.string().min(1, "El nombre completo es requerido."),
  }),
});

export type LocalRegisterRequestDTO = z.infer<
  typeof localRegisterRequestSchema
>["body"];
