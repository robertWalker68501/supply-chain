import * as z from 'zod';

export const purchaseOrderStatuses = [
  'DRAFT',
  'ORDERED',
  'PARTIAL',
  'RECEIVED',
  'CANCELLED',
] as const;

export const purchaseOrderStatusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ORDERED', label: 'Ordered' },
  { value: 'PARTIAL', label: 'Partially received' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;

export const purchaseOrderLineSchema = z.object({
  productId: z.string().min(1, { error: 'Select a product' }),
  description: z.string().max(255, {
    error: 'Description must not exceed 255 characters',
  }),
  quantityOrdered: z
    .string()
    .trim()
    .min(1, { error: 'Quantity is required' })
    .refine((value) => /^\d+$/.test(value), {
      error: 'Quantity must be a whole number',
    })
    .refine((value) => Number(value) >= 1, {
      error: 'Quantity must be at least 1',
    }),
  unitCost: z
    .string()
    .trim()
    .min(1, { error: 'Unit cost is required' })
    .refine((value) => Number.isFinite(Number(value)), {
      error: 'Unit cost must be a number',
    })
    .refine((value) => Number(value) >= 0, {
      error: 'Unit cost cannot be negative',
    }),
});

export const createPurchaseOrderSchema = z
  .object({
    number: z
      .string()
      .trim()
      .max(50, { error: 'Purchase order number must not exceed 50 characters' })
      .regex(/^$|^[A-Za-z0-9-]+$/, {
        error: 'Use letters, numbers, and hyphens only',
      }),
    vendorId: z.string().min(1, { error: 'Select a vendor' }),
    warehouseId: z.string().min(1, { error: 'Select a warehouse' }),
    status: z.enum(purchaseOrderStatuses, {
      error: 'Select a status',
    }),
    orderedAt: z.string(),
    expectedAt: z.string(),
    notes: z.string(),
    lines: z
      .array(purchaseOrderLineSchema)
      .min(1, { error: 'Add at least one line item' }),
  })
  .refine(
    (data) => {
      if (!data.orderedAt || !data.expectedAt) return true;
      return data.expectedAt >= data.orderedAt;
    },
    {
      error: 'Expected date must be on or after the ordered date',
      path: ['expectedAt'],
    }
  );

export type CreatePurchaseOrderInput = z.infer<
  typeof createPurchaseOrderSchema
>;
export type PurchaseOrderLineInput = z.infer<typeof purchaseOrderLineSchema>;
export type PurchaseOrderStatusValue = (typeof purchaseOrderStatuses)[number];
