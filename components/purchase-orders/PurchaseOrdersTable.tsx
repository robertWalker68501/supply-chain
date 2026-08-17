import { format } from 'date-fns';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import Link from 'next/link';

import type { PurchaseOrderListItem } from '@/app/(dashboard)/dashboard/purchase-orders/actions/purchase-orders';
import {
  formatCurrency,
  PurchaseOrderStatusBadge,
} from '@/components/purchase-orders/purchase-order-status';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDate(value: string | null) {
  if (!value) return '—';
  return format(new Date(value), 'MMM d, yyyy');
}

const PurchaseOrdersTable = ({
  purchaseOrders,
}: {
  purchaseOrders: PurchaseOrderListItem[];
}) => {
  if (purchaseOrders.length === 0) {
    return (
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <HiOutlineDocumentDuplicate />
          </EmptyMedia>
          <EmptyTitle>No purchase orders yet</EmptyTitle>
          <EmptyDescription>
            Create a purchase order to start tracking vendor shipments.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={<Link href='/dashboard/purchase-orders/create' />}
          >
            Create purchase order
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className='overflow-hidden rounded-xl border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expected</TableHead>
            <TableHead>Lines</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.map((purchaseOrder) => (
            <TableRow key={purchaseOrder.id}>
              <TableCell className='font-medium'>
                {purchaseOrder.number}
              </TableCell>
              <TableCell>{purchaseOrder.vendorName}</TableCell>
              <TableCell>{purchaseOrder.warehouseName}</TableCell>
              <TableCell>
                <PurchaseOrderStatusBadge status={purchaseOrder.status} />
              </TableCell>
              <TableCell>{formatDate(purchaseOrder.expectedAt)}</TableCell>
              <TableCell>{purchaseOrder.lineCount}</TableCell>
              <TableCell>{formatCurrency(purchaseOrder.total)}</TableCell>
              <TableCell>
                <div className='grid'>
                  <span>{formatDate(purchaseOrder.createdAt)}</span>
                  {purchaseOrder.createdByName ? (
                    <span className='text-muted-foreground text-xs'>
                      {purchaseOrder.createdByName}
                    </span>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PurchaseOrdersTable;
