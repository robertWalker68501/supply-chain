import * as z from 'zod';

export const createWarehouseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(100, { error: 'Name must not exceed 100 characters' }),
});

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
