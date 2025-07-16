import { z } from "zod";

export const getDetailsByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().gt(0, "Invalid format"),
  }),
});

export type getDetailsByIdDTO = z.infer<typeof getDetailsByIdSchema>["params"];
