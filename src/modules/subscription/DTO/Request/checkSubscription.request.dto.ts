import { z } from "zod";

export const checkSubscriptionRequestSchema = z.object({
  params: z.object({
    businessId: z.coerce.number().int().positive(),
  }),
});

export type CheckSubscriptionRequestDTO = z.infer<
  typeof checkSubscriptionRequestSchema
>["params"];
