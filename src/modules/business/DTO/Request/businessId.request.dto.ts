import { z } from "zod";

export const businessIdParamSchema = z.object({
  params: z.object({
    businessId: z.coerce.number({
      invalid_type_error: "businessId must be a number",
    }),
  }),
});

export type BusinessIdParamDTO = z.infer<
  typeof businessIdParamSchema
>["params"];

