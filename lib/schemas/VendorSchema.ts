import * as z from 'zod';

export const createVendorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(100, { error: 'Name must not exceed 100 characters' }),
  slug: z
    .string()
    .trim()
    .max(80, { error: 'Slug must not exceed 80 characters' })
    .regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: 'Use lowercase letters, numbers, and hyphens only',
    }),
  email: z
    .string()
    .trim()
    .max(255, { error: 'Email must not exceed 255 characters' })
    .refine((value) => value === '' || z.email().safeParse(value).success, {
      error: 'Enter a valid email address',
    }),
  phone: z
    .string()
    .trim()
    .max(30, { error: 'Phone must not exceed 30 characters' }),
  notes: z
    .string()
    .trim()
    .max(2000, { error: 'Notes must not exceed 2000 characters' }),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
