import { z } from "zod";

export const updateBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(3, "El nombre del negocio debe tener al menos 3 caracteres.").optional(),
    description: z.string().min(10, "La descripción debe tener al menos 10 caracteres.").optional(),
    email: z.string().email("Formato de email inválido.").optional(),
    logoImage: z.string().url("El logo debe ser una URL válida.").optional(),
    bannerImage: z.string().url("El banner debe ser una URL válida.").optional(),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres.").optional(),
    location_latitude: z.number().optional(),
    location_longitude: z.number().optional(),
    // Asumiendo que las categorías se envían como un array de IDs
    categories: z.array(z.number().int().positive("Cada ID de categoría debe ser un número entero positivo.")).optional(),
  }),
  params: z.object({
    id: z.coerce.number().int().positive("El ID del negocio debe ser un número entero positivo."),
  }),
});

export type UpdateBusinessRequestDTO = z.infer<typeof updateBusinessSchema>["body"];
export type UpdateBusinessParamsDTO = z.infer<typeof updateBusinessSchema>["params"];
