import { z } from 'zod';

export const getBusinessStatsRequestDto = z.object({
  query: z.object({
    businessId: z.string().nonempty('El ID del negocio es requerido'),
  }),
});
