'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { Prisma } from '@/app/generated/prisma/client';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  createProductSchema,
  type CreateProductInput,
} from '@/lib/schemas/ProductSchema';
import { slugify } from '@/lib/utils';

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

export type ProductListItem = {
  id: string;
  sku: string;
  name: string;
  image: string | null;
  unit: string;
  cost: number;
  price: number;
  reorderPoint: number;
  createdAt: string;
};

export type ProductDetail = {
  id: string;
} & CreateProductInput;

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

async function resolveProductSlug(
  name: string,
  requestedSlug?: string,
  excludeId?: string
) {
  const base = slugify(requestedSlug || name);

  if (!base) {
    return null;
  }

  if (requestedSlug) {
    return base;
  }

  const existing = await prisma.product.findFirst({
    where: {
      slug: base,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });

  if (!existing) {
    return base;
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function getProducts(): Promise<ActionResult<ProductListItem[]>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view products.',
    };
  }

  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      sku: true,
      name: true,
      image: true,
      unit: true,
      cost: true,
      price: true,
      reorderPoint: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    data: products.map((product) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      image: product.image,
      unit: product.unit,
      cost: Number(product.cost),
      price: Number(product.price),
      reorderPoint: product.reorderPoint,
      createdAt: product.createdAt.toISOString(),
    })),
  };
}

export async function createProduct(
  input: CreateProductInput
): Promise<ActionResult<{ id: string; name: string; sku: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to create a product.',
    };
  }

  const parsed = createProductSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Please correct the form and try again.',
    };
  }

  const data = parsed.data;
  const slug = await resolveProductSlug(data.name, emptyToUndefined(data.slug));

  if (!slug) {
    return {
      success: false,
      error: 'Enter a name that can be converted into a URL slug.',
    };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        slug,
        description: emptyToUndefined(data.description),
        unit: data.unit,
        cost: Number(data.cost).toFixed(2),
        price: Number(data.price).toFixed(2),
        reorderPoint: Number(data.reorderPoint),
        leadTimeDays: Number(data.leadTimeDays),
        tags: data.tags,
      },
      select: {
        id: true,
        name: true,
        sku: true,
      },
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/products/create');
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target;
      const fields = Array.isArray(target)
        ? target.map((field) => String(field))
        : [];

      if (fields.includes('sku')) {
        return {
          success: false,
          error: 'A product with this SKU already exists.',
        };
      }

      if (fields.includes('slug')) {
        return {
          success: false,
          error: 'A product with this slug already exists.',
        };
      }

      return {
        success: false,
        error: 'A product with this SKU or slug already exists.',
      };
    }

    return {
      success: false,
      error: 'Failed to create the product. Please try again.',
    };
  }
}

export async function getProduct(
  id: string
): Promise<ActionResult<ProductDetail>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view products.',
    };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      sku: true,
      slug: true,
      description: true,
      unit: true,
      cost: true,
      price: true,
      reorderPoint: true,
      leadTimeDays: true,
      tags: true,
    },
  });

  if (!product) {
    return {
      success: false,
      error: 'The product was not found.',
    };
  }

  return {
    success: true,
    data: {
      id: product.id,
      name: product.name,
      sku: product.sku,
      slug: product.slug,
      description: product.description ?? '',
      unit: product.unit,
      cost: Number(product.cost).toFixed(2),
      price: Number(product.price).toFixed(2),
      reorderPoint: String(product.reorderPoint),
      leadTimeDays: String(product.leadTimeDays),
      tags: product.tags,
    },
  };
}

export async function updateProduct(
  id: string,
  input: CreateProductInput
): Promise<ActionResult<{ id: string; name: string; sku: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to update a product.',
    };
  }

  const parsed = createProductSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Please correct the form and try again.',
    };
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return {
      success: false,
      error: 'The product was not found.',
    };
  }

  const data = parsed.data;
  const slug = await resolveProductSlug(
    data.name,
    emptyToUndefined(data.slug),
    id
  );

  if (!slug) {
    return {
      success: false,
      error: 'Enter a name that can be converted into a URL slug.',
    };
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        sku: data.sku,
        slug,
        description: emptyToUndefined(data.description) ?? null,
        unit: data.unit,
        cost: Number(data.cost).toFixed(2),
        price: Number(data.price).toFixed(2),
        reorderPoint: Number(data.reorderPoint),
        leadTimeDays: Number(data.leadTimeDays),
        tags: data.tags,
      },
      select: {
        id: true,
        name: true,
        sku: true,
      },
    });

    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${id}`);
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const target = error.meta?.target;
      const fields = Array.isArray(target)
        ? target.map((field) => String(field))
        : [];

      if (fields.includes('sku')) {
        return {
          success: false,
          error: 'A product with this SKU already exists.',
        };
      }

      if (fields.includes('slug')) {
        return {
          success: false,
          error: 'A product with this slug already exists.',
        };
      }

      return {
        success: false,
        error: 'A product with this SKU or slug already exists.',
      };
    }

    return {
      success: false,
      error: 'Failed to update the product. Please try again.',
    };
  }
}

export async function deleteProduct(
  id: string
): Promise<ActionResult<{ id: string; name: string; sku: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to delete a product.',
    };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      sku: true,
      _count: {
        select: {
          purchaseOrderLines: true,
          receiptLines: true,
          stockMovements: true,
        },
      },
    },
  });

  if (!product) {
    return {
      success: false,
      error: 'The product was not found.',
    };
  }

  if (
    product._count.purchaseOrderLines > 0 ||
    product._count.receiptLines > 0 ||
    product._count.stockMovements > 0
  ) {
    return {
      success: false,
      error:
        'This product cannot be deleted because it is used on purchase orders, receipts, or stock movements.',
    };
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/dashboard/products');
    revalidatePath(`/dashboard/products/${id}`);
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: product.id,
        name: product.name,
        sku: product.sku,
      },
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      return {
        success: false,
        error:
          'This product cannot be deleted because it is used on purchase orders, receipts, or stock movements.',
      };
    }

    return {
      success: false,
      error: 'Failed to delete the product. Please try again.',
    };
  }
}
