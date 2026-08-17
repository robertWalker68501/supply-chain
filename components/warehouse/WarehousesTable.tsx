import { format } from 'date-fns';
import { Warehouse } from 'lucide-react';
import Link from 'next/link';

import type { WarehouseListItem } from '@/app/(dashboard)/dashboard/warehouse/actions/warehouse';
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

const WarehousesTable = ({
  warehouses,
}: {
  warehouses: WarehouseListItem[];
}) => {
  if (warehouses.length === 0) {
    return (
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Warehouse />
          </EmptyMedia>
          <EmptyTitle>No warehouses yet</EmptyTitle>
          <EmptyDescription>
            Add a warehouse before you create a purchase order.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={<Link href='/dashboard/warehouse/create' />}
          >
            Create warehouse
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
            <TableHead>Name</TableHead>
            <TableHead>Locations</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warehouses.map((warehouse) => (
            <TableRow key={warehouse.id}>
              <TableCell className='font-medium'>{warehouse.name}</TableCell>
              <TableCell>{warehouse.locationCount}</TableCell>
              <TableCell>
                {format(new Date(warehouse.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  nativeButton={false}
                  render={<Link href={`/dashboard/warehouse/${warehouse.id}`} />}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WarehousesTable;
