import { z } from 'zod';

export const refreshTokenRequestSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export type RefreshTokenRequestDTO = z.infer<typeof refreshTokenRequestSchema>['body'];
