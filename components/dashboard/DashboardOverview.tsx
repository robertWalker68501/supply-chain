import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  Building2,
  CalendarClock,
  CircleAlert,
  ClipboardList,
  Package,
  Warehouse,
} from 'lucide-react';
import { HiOutlineDocumentAdd } from 'react-icons/hi';

import type { DashboardOverview } from '@/app/(dashboard)/dashboard/actions/dashboard';
import PurchaseOrdersTable from '@/components/purchase-orders/PurchaseOrdersTable';
import {
  formatCurrency,
  getPurchaseOrderStatusLabel,
} from '@/components/purchase-orders/purchase-order-status';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  purchaseOrderStatusOptions,
  type PurchaseOrderStatusValue,
} from '@/lib/schemas/PurchaseOrderSchema';

type DashboardOverviewProps = {
  overview: DashboardOverview;
};

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'there';
}

function StatCard({
  label,
  value,
  href,
  icon: Icon,
  description,
  warn = false,
}: {
  label: string;
  value: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
  warn?: boolean;
}) {
  return (
    <Card className={warn ? 'ring-destructive/40 ring-1' : undefined}>
      <CardHeader>
        <CardDescription className='flex items-center gap-2'>
          <Icon className='size-4' />
          {label}
        </CardDescription>
        <CardTitle className='text-3xl font-bold'>{value}</CardTitle>
        <CardAction>
          <Button
            variant='ghost'
            size='sm'
            nativeButton={false}
            render={<Link href={href} />}
          >
            View
          </Button>
        </CardAction>
      </CardHeader>
      {description ? (
        <CardContent>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

const DashboardOverview = ({ overview }: DashboardOverviewProps) => {
  const missingCatalog = [
    overview.vendorCount === 0
      ? { href: '/dashboard/vendors/create', label: 'Create vendor' }
      : null,
    overview.warehouseCount === 0
      ? { href: '/dashboard/warehouse/create', label: 'Create warehouse' }
      : null,
    overview.productCount === 0
      ? { href: '/dashboard/products/create', label: 'Create product' }
      : null,
  ].filter((item): item is { href: string; label: string } => item !== null);

  const statusEntries = purchaseOrderStatusOptions.map((option) => ({
    status: option.value as PurchaseOrderStatusValue,
    label: option.label,
    count: overview.statusCounts[option.value],
  }));

  return (
    <div className='grid w-full max-w-6xl gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div className='grid gap-1'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <p className='text-muted-foreground text-sm'>
            Welcome back, {firstName(overview.userName)}. Here is a snapshot of
            your catalog and purchasing activity.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href='/dashboard/purchase-orders/create' />}
        >
          <HiOutlineDocumentAdd />
          Create purchase order
        </Button>
      </div>

      {missingCatalog.length > 0 ? (
        <Alert>
          <CircleAlert />
          <AlertTitle>Finish setting up the catalog</AlertTitle>
          <AlertDescription>
            <p>
              Add at least one vendor, warehouse, and product before creating a
              purchase order.
            </p>
            <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1'>
              {missingCatalog.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      {overview.overdueCount > 0 ? (
        <Alert variant='destructive'>
          <CircleAlert />
          <AlertTitle>Overdue purchase orders</AlertTitle>
          <AlertDescription>
            {overview.overdueCount} ordered{' '}
            {overview.overdueCount === 1 ? 'shipment is' : 'shipments are'} past
            the expected date.{' '}
            <Link href='/dashboard/purchase-orders'>
              Review purchase orders
            </Link>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          label='Vendors'
          value={String(overview.vendorCount)}
          href='/dashboard/vendors'
          icon={Building2}
          description='Suppliers you can order from'
        />
        <StatCard
          label='Warehouses'
          value={String(overview.warehouseCount)}
          href='/dashboard/warehouse'
          icon={Warehouse}
          description='Receiving destinations'
        />
        <StatCard
          label='Products'
          value={String(overview.productCount)}
          href='/dashboard/products'
          icon={Package}
          description='Items in the catalog'
        />
        <StatCard
          label='Purchase orders'
          value={String(overview.purchaseOrderCount)}
          href='/dashboard/purchase-orders'
          icon={ClipboardList}
          description='All recorded orders'
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          label='Open orders'
          value={String(overview.openOrderCount)}
          href='/dashboard/purchase-orders'
          icon={ClipboardList}
          description='Draft, ordered, or partially received'
        />
        <StatCard
          label='Open order value'
          value={formatCurrency(overview.openOrderTotal)}
          href='/dashboard/purchase-orders'
          icon={ClipboardList}
          description='Total of open purchase orders'
        />
        <StatCard
          label='Expected this week'
          value={String(overview.expectedThisWeekCount)}
          href='/dashboard/purchase-orders'
          icon={CalendarClock}
          description='Open orders due in the next 7 days'
        />
        <StatCard
          label='Overdue'
          value={String(overview.overdueCount)}
          href='/dashboard/purchase-orders'
          icon={CircleAlert}
          description='Ordered shipments past the expected date'
          warn={overview.overdueCount > 0}
        />
      </div>

      <div className='grid gap-4 lg:grid-cols-[1.4fr_1fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
            <CardDescription>
              How current purchase orders are progressing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='grid gap-3'>
              {statusEntries.map((entry) => (
                <li
                  key={entry.status}
                  className='flex items-center justify-between gap-4 text-sm'
                >
                  <span>{getPurchaseOrderStatusLabel(entry.status)}</span>
                  <span className='font-medium'>{entry.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>
              Jump to the most common catalog and purchasing tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-2'>
            <Button
              variant='outline'
              nativeButton={false}
              render={<Link href='/dashboard/purchase-orders/create' />}
            >
              Create purchase order
            </Button>
            <Button
              variant='outline'
              nativeButton={false}
              render={<Link href='/dashboard/vendors/create' />}
            >
              Create vendor
            </Button>
            <Button
              variant='outline'
              nativeButton={false}
              render={<Link href='/dashboard/warehouse/create' />}
            >
              Create warehouse
            </Button>
            <Button
              variant='outline'
              nativeButton={false}
              render={<Link href='/dashboard/products/create' />}
            >
              Create product
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='grid gap-1'>
            <h2 className='text-xl font-semibold'>Recent purchase orders</h2>
            <p className='text-muted-foreground text-sm'>
              The five most recently created orders.
            </p>
          </div>
          <Button
            variant='outline'
            nativeButton={false}
            render={<Link href='/dashboard/purchase-orders' />}
          >
            View all
          </Button>
        </div>
        <PurchaseOrdersTable purchaseOrders={overview.recentPurchaseOrders} />
      </div>
    </div>
  );
};

export default DashboardOverview;
