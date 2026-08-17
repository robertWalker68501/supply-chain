import * as z from 'zod';

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(3, { error: 'Name must be at least 3 characters in length' })
      .max(30, { error: 'Name must not exceed 30 characters in length' }),
    email: z.email(),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters in length' })
      .max(30, { error: 'Password must not exceed 30 characters in length' }),
    confirmPassword: z.string(),
    callbackURL: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signInUserSchema = z.object({
  email: z.email(),
  password: z.string(),
  callbackURL: z.string().optional(),
});
