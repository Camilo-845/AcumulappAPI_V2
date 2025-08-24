import { z } from "zod";

export const getDetailsByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().gt(0, "Invalid format"),
  }),
});

export type getDetailsByIdDTO = z.infer<typeof getDetailsByIdSchema>["params"];

export const getDetailsByIdQuerySchema = z.object({
  query: z.object({
    isActive: z
      .enum(["true", "false"], {
        errorMap: () => ({ message: "isActive must be 'true' or 'false'" }),
      })
      .transform((val) => val === "true")
      .optional(),
  }),
});

export type getDetailsByIdQueryDTO = z.infer<
  typeof getDetailsByIdQuerySchema
>["query"];
