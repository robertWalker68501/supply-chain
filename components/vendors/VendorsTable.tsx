import { format } from 'date-fns';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

import type { VendorListItem } from '@/app/(dashboard)/dashboard/vendors/actions/vendors';
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

const VendorsTable = ({ vendors }: { vendors: VendorListItem[] }) => {
  if (vendors.length === 0) {
    return (
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>No vendors yet</EmptyTitle>
          <EmptyDescription>
            Add a vendor before you create a purchase order.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={<Link href='/dashboard/vendors/create' />}
          >
            Create vendor
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
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className='font-medium'>{vendor.name}</TableCell>
              <TableCell>{vendor.email ?? '—'}</TableCell>
              <TableCell>{vendor.phone ?? '—'}</TableCell>
              <TableCell>
                {format(new Date(vendor.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  nativeButton={false}
                  render={<Link href={`/dashboard/vendors/${vendor.id}`} />}
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

export default VendorsTable;
