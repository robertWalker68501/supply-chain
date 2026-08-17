'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { Prisma } from '@/app/generated/prisma/client';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  createVendorSchema,
  type CreateVendorInput,
} from '@/lib/schemas/VendorSchema';
import { slugify } from '@/lib/utils';

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

export type VendorListItem = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
};

export type VendorDetail = {
  id: string;
} & CreateVendorInput;

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

async function resolveVendorSlug(
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

  const existing = await prisma.vendor.findFirst({
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

export async function getVendors(): Promise<ActionResult<VendorListItem[]>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view vendors.',
    };
  }

  const vendors = await prisma.vendor.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    data: vendors.map((vendor) => ({
      ...vendor,
      createdAt: vendor.createdAt.toISOString(),
    })),
  };
}

export async function createVendor(
  input: CreateVendorInput
): Promise<ActionResult<{ id: string; name: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to create a vendor.',
    };
  }

  const parsed = createVendorSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Please correct the form and try again.',
    };
  }

  const data = parsed.data;
  const slug = await resolveVendorSlug(data.name, emptyToUndefined(data.slug));

  if (!slug) {
    return {
      success: false,
      error: 'Enter a name that can be converted into a URL slug.',
    };
  }

  try {
    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        slug,
        email: emptyToUndefined(data.email),
        phone: emptyToUndefined(data.phone),
        notes: emptyToUndefined(data.notes),
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath('/dashboard/vendors');
    revalidatePath('/dashboard/vendors/create');
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: vendor,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'A vendor with this slug already exists.',
      };
    }

    return {
      success: false,
      error: 'Failed to create the vendor. Please try again.',
    };
  }
}

export async function getVendor(
  id: string
): Promise<ActionResult<VendorDetail>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view vendors.',
    };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      phone: true,
      notes: true,
    },
  });

  if (!vendor) {
    return {
      success: false,
      error: 'The vendor was not found.',
    };
  }

  return {
    success: true,
    data: {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      email: vendor.email ?? '',
      phone: vendor.phone ?? '',
      notes: vendor.notes ?? '',
    },
  };
}

export async function updateVendor(
  id: string,
  input: CreateVendorInput
): Promise<ActionResult<{ id: string; name: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to update a vendor.',
    };
  }

  const parsed = createVendorSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      success: false,
      error: firstIssue?.message ?? 'Please correct the form and try again.',
    };
  }

  const existing = await prisma.vendor.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return {
      success: false,
      error: 'The vendor was not found.',
    };
  }

  const data = parsed.data;
  const slug = await resolveVendorSlug(
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
    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        email: emptyToUndefined(data.email) ?? null,
        phone: emptyToUndefined(data.phone) ?? null,
        notes: emptyToUndefined(data.notes) ?? null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    revalidatePath('/dashboard/vendors');
    revalidatePath(`/dashboard/vendors/${id}`);
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: vendor,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'A vendor with this slug already exists.',
      };
    }

    return {
      success: false,
      error: 'Failed to update the vendor. Please try again.',
    };
  }
}

export async function deleteVendor(
  id: string
): Promise<ActionResult<{ id: string; name: string }>> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to delete a vendor.',
    };
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      _count: {
        select: { purchaseOrders: true },
      },
    },
  });

  if (!vendor) {
    return {
      success: false,
      error: 'The vendor was not found.',
    };
  }

  if (vendor._count.purchaseOrders > 0) {
    return {
      success: false,
      error:
        'This vendor cannot be deleted because it is used on one or more purchase orders.',
    };
  }

  try {
    await prisma.vendor.delete({
      where: { id },
    });

    revalidatePath('/dashboard/vendors');
    revalidatePath(`/dashboard/vendors/${id}`);
    revalidatePath('/dashboard/purchase-orders/create');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: vendor.id,
        name: vendor.name,
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
          'This vendor cannot be deleted because it is used on one or more purchase orders.',
      };
    }

    return {
      success: false,
      error: 'Failed to delete the vendor. Please try again.',
    };
  }
}
