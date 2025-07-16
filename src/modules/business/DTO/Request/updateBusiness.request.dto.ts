import { z } from "zod";

export const updateBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(3, "El nombre del negocio debe tener al menos 3 caracteres.").optional(),
    email: z.string().email("Formato de email inválido.").optional(),
    idLocation: z.number().int().positive("El ID de ubicación debe ser un número entero positivo.").optional(),
    logoImage: z.string().url("El logo debe ser una URL válida.").optional(),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres.").optional(),
    // Asumiendo que las categorías se envían como un array de IDs
    categories: z.array(z.number().int().positive("Cada ID de categoría debe ser un número entero positivo.")).optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive("El ID del negocio debe ser un número entero positivo."),
  }),
});

export type UpdateBusinessRequestDTO = z.infer<typeof updateBusinessSchema>["body"];
export type UpdateBusinessParamsDTO = z.infer<typeof updateBusinessSchema>["params"];
