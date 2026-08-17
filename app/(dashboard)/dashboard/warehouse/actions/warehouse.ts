'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  createWarehouseSchema,
  type CreateWarehouseInput,
} from '@/lib/schemas/WarehouseSchema';

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

export type WarehouseListItem = {
  id: string;
  name: string;
  locationCount: number;
  createdAt: string;
};

export type WarehouseDetail = {
  id: string;
} & CreateWarehouseInput;

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

export async function getWarehouses(): Promise<
  ActionResult<WarehouseListItem[]>
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view warehouses.',
    };
  }

  const warehouses = await prisma.warehouse.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: { locations: true },
      },
    },
  });

  return {
    success: true,
    data: warehouses.map((warehouse) => ({
      id: warehouse.id,
      name: warehouse.name,
      locationCount: warehouse._count.locations,
      createdAt: warehouse.createdAt.toISOString(),
    })),
  };
}

export async function createWarehouse(
  input: CreateWarehouseInput
): Promise<ActionResult<{ id: string; name: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to create a warehouse.',
    };
  }

  const parsed = createWarehouseSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Please correct the form and try again.',
    };
  }

  try {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: parsed.data.name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath('/dashboard/warehouse');
    revalidatePath('/dashboard/warehouse/create');
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: warehouse,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to create the warehouse. Please try again.',
    };
  }
}

export async function getWarehouse(
  id: string
): Promise<ActionResult<WarehouseDetail>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view warehouses.',
    };
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

  if (!warehouse) {
    return {
      success: false,
      error: 'The warehouse was not found.',
    };
  }

  return {
    success: true,
    data: warehouse,
  };
}

export async function updateWarehouse(
  id: string,
  input: CreateWarehouseInput
): Promise<ActionResult<{ id: string; name: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to update a warehouse.',
    };
  }

  const parsed = createWarehouseSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Please correct the form and try again.',
    };
  }

  const existing = await prisma.warehouse.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return {
      success: false,
      error: 'The warehouse was not found.',
    };
  }

  try {
    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: {
        name: parsed.data.name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath('/dashboard/warehouse');
    revalidatePath(`/dashboard/warehouse/${id}`);
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: warehouse,
    };
  } catch {
    return {
      success: false,
      error: 'Failed to update the warehouse. Please try again.',
    };
  }
}

export async function deleteWarehouse(
  id: string
): Promise<ActionResult<{ id: string; name: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to delete a warehouse.',
    };
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          purchaseOrders: true,
          receipts: true,
        },
      },
    },
  });

  if (!warehouse) {
    return {
      success: false,
      error: 'The warehouse was not found.',
    };
  }

  if (warehouse._count.purchaseOrders > 0 || warehouse._count.receipts > 0) {
    return {
      success: false,
      error:
        'This warehouse cannot be deleted because it is used on purchase orders or receipts.',
    };
  }

  try {
    await prisma.warehouse.delete({
      where: { id },
    });

    revalidatePath('/dashboard/warehouse');
    revalidatePath(`/dashboard/warehouse/${id}`);
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: warehouse.id,
        name: warehouse.name,
      },
    };
  } catch {
    return {
      success: false,
      error: 'Failed to delete the warehouse. Please try again.',
    };
  }
}
