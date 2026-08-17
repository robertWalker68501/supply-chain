'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  purchaseOrderStatuses,
  type PurchaseOrderStatusValue,
} from '@/lib/schemas/PurchaseOrderSchema';
import type { PurchaseOrderListItem } from '@/app/(dashboard)/dashboard/purchase-orders/actions/purchase-orders';

export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };

const openStatuses: PurchaseOrderStatusValue[] = [
  'DRAFT',
  'ORDERED',
  'PARTIAL',
];

export type DashboardOverview = {
  userName: string;
  vendorCount: number;
  warehouseCount: number;
  productCount: number;
  purchaseOrderCount: number;
  openOrderCount: number;
  openOrderTotal: number;
  expectedThisWeekCount: number;
  overdueCount: number;
  statusCounts: Record<PurchaseOrderStatusValue, number>;
  recentPurchaseOrders: PurchaseOrderListItem[];
};

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

function mapPurchaseOrder(purchaseOrder: {
  id: string;
  number: string;
  status: PurchaseOrderStatusValue;
  orderedAt: Date | null;
  expectedAt: Date | null;
  createdAt: Date;
  vendor: { name: string };
  warehouse: { name: string };
  createdBy: { name: string } | null;
  lines: { quantityOrdered: number; unitCost: unknown }[];
}): PurchaseOrderListItem {
  return {
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
  };
}

export async function getDashboardOverview(): Promise<
  ActionResult<DashboardOverview>
> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be signed in to view the dashboard.',
    };
  }

  const today = startOfToday();
  const weekFromNow = addDays(today, 7);
  const purchaseOrderInclude = {
    vendor: { select: { name: true } },
    warehouse: { select: { name: true } },
    createdBy: { select: { name: true } },
    lines: {
      select: {
        quantityOrdered: true,
        unitCost: true,
      },
    },
  } as const;

  const [
    vendorCount,
    warehouseCount,
    productCount,
    purchaseOrderCount,
    statusGroups,
    openOrders,
    expectedThisWeekCount,
    overdueCount,
    recentPurchaseOrders,
  ] = await Promise.all([
    prisma.vendor.count(),
    prisma.warehouse.count(),
    prisma.product.count(),
    prisma.purchaseOrder.count(),
    prisma.purchaseOrder.groupBy({
      by: ['status'],
      _count: { _all: true },
    }),
    prisma.purchaseOrder.findMany({
      where: { status: { in: openStatuses } },
      select: {
        lines: {
          select: {
            quantityOrdered: true,
            unitCost: true,
          },
        },
      },
    }),
    prisma.purchaseOrder.count({
      where: {
        status: { in: openStatuses },
        expectedAt: {
          gte: today,
          lt: weekFromNow,
        },
      },
    }),
    prisma.purchaseOrder.count({
      where: {
        status: { in: ['ORDERED', 'PARTIAL'] },
        expectedAt: { lt: today },
      },
    }),
    prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: purchaseOrderInclude,
    }),
  ]);

  const statusCounts = Object.fromEntries(
    purchaseOrderStatuses.map((status) => [status, 0])
  ) as Record<PurchaseOrderStatusValue, number>;

  for (const group of statusGroups) {
    statusCounts[group.status] = group._count._all;
  }

  const openOrderTotal = openOrders.reduce(
    (sum, purchaseOrder) =>
      sum +
      purchaseOrder.lines.reduce(
        (lineSum, line) =>
          lineSum + Number(line.unitCost) * line.quantityOrdered,
        0
      ),
    0
  );

  return {
    success: true,
    data: {
      userName: user.name?.trim() || 'there',
      vendorCount,
      warehouseCount,
      productCount,
      purchaseOrderCount,
      openOrderCount: openOrders.length,
      openOrderTotal,
      expectedThisWeekCount,
      overdueCount,
      statusCounts,
      recentPurchaseOrders: recentPurchaseOrders.map(mapPurchaseOrder),
    },
  };
}
