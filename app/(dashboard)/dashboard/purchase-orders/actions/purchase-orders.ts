'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { Prisma } from '@/app/generated/prisma/client';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  createPurchaseOrderSchema,
  type CreatePurchaseOrderInput,
} from '@/lib/schemas/PurchaseOrderSchema';

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

export type PurchaseOrderFormOptions = {
  vendors: { value: string; label: string }[];
  warehouses: { value: string; label: string }[];
  products: { value: string; label: string; cost: number }[];
};

export type PurchaseOrderListItem = {
  id: string;
  number: string;
  status: CreatePurchaseOrderInput['status'];
  orderedAt: string | null;
  expectedAt: string | null;
  createdAt: string;
  vendorName: string;
  warehouseName: string;
  createdByName: string | null;
  lineCount: number;
  total: number;
};

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

function emptyToUndefined(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function emptyHtmlToUndefined(html: string | undefined) {
  if (!html) return undefined;

  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > 0 ? html : undefined;
}

function parseDateInput(value: string | undefined) {
  const dateValue = emptyToUndefined(value);
  if (!dateValue) return undefined;

  const [year, month, day] = dateValue.split('-').map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

async function generatePurchaseOrderNumber() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const prefix = `PO-${stamp}-`;

  const latest = await prisma.purchaseOrder.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: 'desc' },
    select: { number: true },
  });

  const sequence = latest
    ? Number.parseInt(latest.number.slice(prefix.length), 10) + 1
    : 1;

  if (!Number.isFinite(sequence) || sequence < 1) {
    return `${prefix}${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  }

  return `${prefix}${String(sequence).padStart(4, '0')}`;
}

export async function getPurchaseOrderFormOptions(): Promise<
  ActionResult<PurchaseOrderFormOptions>
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to create a purchase order.',
    };
  }

  const [vendors, warehouses, products] = await Promise.all([
    prisma.vendor.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.warehouse.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      select: { id: true, name: true, sku: true, cost: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    success: true,
    data: {
      vendors: vendors.map((vendor) => ({
        value: vendor.id,
        label: vendor.name,
      })),
      warehouses: warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.name,
      })),
      products: products.map((product) => ({
        value: product.id,
        label: `${product.sku} — ${product.name}`,
        cost: Number(product.cost),
      })),
    },
  };
}

export async function getPurchaseOrders(): Promise<
  ActionResult<PurchaseOrderListItem[]>
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view purchase orders.',
    };
  }

  const purchaseOrders = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      vendor: { select: { name: true } },
      warehouse: { select: { name: true } },
      createdBy: { select: { name: true } },
      lines: {
        select: {
          quantityOrdered: true,
          unitCost: true,
        },
      },
    },
  });

  return {
    success: true,
    data: purchaseOrders.map((purchaseOrder) => ({
      id: purchaseOrder.id,
      number: purchaseOrder.number,
      status: purchaseOrder.status,
      orderedAt: purchaseOrder.orderedAt?.toISOString() ?? null,
      expectedAt: purchaseOrder.expectedAt?.toISOString() ?? null,
      createdAt: purchaseOrder.createdAt.toISOString(),
      vendorName: purchaseOrder.vendor.name,
      warehouseName: purchaseOrder.warehouse.name,
      createdByName: purchaseOrder.createdBy?.name ?? null,
      lineCount: purchaseOrder.lines.length,
      total: purchaseOrder.lines.reduce(
        (sum, line) => sum + Number(line.unitCost) * line.quantityOrdered,
        0
      ),
    })),
  };
}

export async function createPurchaseOrder(
  input: CreatePurchaseOrderInput
): Promise<ActionResult<{ id: string; number: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to create a purchase order.',
    };
  }

  const parsed = createPurchaseOrderSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Please correct the form and try again.',
    };
  }

  const data = parsed.data;
  const productIds = [...new Set(data.lines.map((line) => line.productId))];

  const [vendor, warehouse, products] = await Promise.all([
    prisma.vendor.findUnique({
      where: { id: data.vendorId },
      select: { id: true },
    }),
    prisma.warehouse.findUnique({
      where: { id: data.warehouseId },
      select: { id: true },
    }),
    prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    }),
  ]);

  if (!vendor) {
    return { success: false, error: 'The selected vendor was not found.' };
  }

  if (!warehouse) {
    return { success: false, error: 'The selected warehouse was not found.' };
  }

  if (products.length !== productIds.length) {
    return {
      success: false,
      error: 'One or more selected products were not found.',
    };
  }

  const orderedAt =
    parseDateInput(data.orderedAt) ??
    (data.status === 'ORDERED' ? new Date() : undefined);
  const expectedAt = parseDateInput(data.expectedAt);
  const notes = emptyHtmlToUndefined(data.notes);
  const requestedNumber = emptyToUndefined(data.number);

  const maxAttempts = requestedNumber ? 1 : 3;

  try {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const number = requestedNumber ?? (await generatePurchaseOrderNumber());

        const purchaseOrder = await prisma.purchaseOrder.create({
          data: {
            number,
            status: data.status,
            orderedAt,
            expectedAt,
            notes,
            vendorId: data.vendorId,
            warehouseId: data.warehouseId,
            createdById: user.id,
            lines: {
              create: data.lines.map((line) => ({
                productId: line.productId,
                description: emptyToUndefined(line.description),
                quantityOrdered: Number(line.quantityOrdered),
                unitCost: Number(line.unitCost).toFixed(2),
              })),
            },
          },
          select: {
            id: true,
            number: true,
          },
        });

        revalidatePath('/dashboard/purchase-orders');
        revalidatePath('/dashboard/purchase-orders/create');
        revalidatePath('/dashboard');

        return {
          success: true,
          data: purchaseOrder,
        };
      } catch (error) {
        const isDuplicateNumber =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002';

        if (
          !isDuplicateNumber ||
          requestedNumber ||
          attempt === maxAttempts - 1
        ) {
          throw error;
        }
      }
    }

    return {
      success: false,
      error: 'A purchase order with this number already exists.',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'A purchase order with this number already exists.',
      };
    }

    return {
      success: false,
      error: 'Failed to create the purchase order. Please try again.',
    };
  }
}
