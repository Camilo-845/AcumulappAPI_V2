import { z } from "zod";

export const loginRequestSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido.").min(1, "El email es requerido."),
    password: z.string().min(1, "La contraseña es requerida."),
    userType: z
      .enum(["client", "collaborator"], {
        errorMap: () => ({
          message:
            'Tipo de usuario inválido. Debe ser "client" o "collaborator".',
        }),
      })
      .optional(), // Podría ser opcional y deducirse si no se envía
  }),
});

export type LoginRequestDTO = z.infer<typeof loginRequestSchema>["body"];
