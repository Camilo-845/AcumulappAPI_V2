import { z } from "zod";

export const clerkSignInRequestSchema = z.object({
  body: z.object({
    token: z.string().min(1, "El token es requerido."),
  }),
  query: z.object({
    userType: z.enum(["client", "business"]).default("client"),
  }),
});

export type ClerkSignInRequestDTO = z.infer<typeof clerkSignInRequestSchema>["body"];
export type ClerkSignInQueryDTO = z.infer<typeof clerkSignInRequestSchema>["query"];
