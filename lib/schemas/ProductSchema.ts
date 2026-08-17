import * as z from 'zod';

const moneyField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} is required` })
    .refine((value) => Number.isFinite(Number(value)), {
      error: `${label} must be a number`,
    })
    .refine((value) => Number(value) >= 0, {
      error: `${label} cannot be negative`,
    });

const wholeNumberField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `${label} is required` })
    .refine((value) => /^\d+$/.test(value), {
      error: `${label} must be a whole number`,
    })
    .refine((value) => Number(value) >= 0, {
      error: `${label} cannot be negative`,
    });

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(150, { error: 'Name must not exceed 150 characters' }),
  sku: z
    .string()
    .trim()
    .min(1, { error: 'SKU is required' })
    .max(50, { error: 'SKU must not exceed 50 characters' })
    .regex(/^[A-Za-z0-9][A-Za-z0-9-_]*$/, {
      error: 'Use letters, numbers, hyphens, and underscores only',
    }),
  slug: z
    .string()
    .trim()
    .max(80, { error: 'Slug must not exceed 80 characters' })
    .regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: 'Use lowercase letters, numbers, and hyphens only',
    }),
  description: z
    .string()
    .trim()
    .max(2000, { error: 'Description must not exceed 2000 characters' }),
  unit: z
    .string()
    .trim()
    .min(1, { error: 'Unit is required' })
    .max(10, { error: 'Unit must not exceed 10 characters' }),
  cost: moneyField('Cost'),
  price: moneyField('Price'),
  reorderPoint: wholeNumberField('Reorder point'),
  leadTimeDays: wholeNumberField('Lead time'),
  tags: z.array(z.string().min(1).max(30)).max(10),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
