import { z } from "zod";

export const updateBusinessLinksSchema = z.object({
  body: z.object({
    links: z.array(
      z.object({
        idLink: z.number().int().positive(),
        value: z.string().url(),
      }),
    ),
  }),
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export type UpdateBusinessLinksRequestDTO = z.infer<
  typeof updateBusinessLinksSchema
>["body"];
