import { z } from "zod";

export const updateAccountRequestSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "El nombre completo es requerido.").optional(),
    profileImageURL: z
      .string()
      .url("La URL de la imagen de perfil no es válida.")
      .optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export type UpdateAccountRequestDTO = z.infer<
  typeof updateAccountRequestSchema
>["body"];
export type UpdateAccountRequestParamsDTO = z.infer<
  typeof updateAccountRequestSchema
>["params"];
