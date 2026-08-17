import { format } from 'date-fns';
import { Package } from 'lucide-react';
import Link from 'next/link';

import type { ProductListItem } from '@/app/(dashboard)/dashboard/products/actions/products';
import { formatCurrency } from '@/components/purchase-orders/purchase-order-status';
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

const ProductsTable = ({ products }: { products: ProductListItem[] }) => {
  if (products.length === 0) {
    return (
      <Empty className='border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Package />
          </EmptyMedia>
          <EmptyTitle>No products yet</EmptyTitle>
          <EmptyDescription>
            Add a product before you create a purchase order.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={<Link href='/dashboard/products/create' />}
          >
            Create product
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
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Reorder point</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt=''
                      className='size-10 rounded-md border object-cover'
                    />
                  ) : (
                    <div className='bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-md border'>
                      <Package className='size-4' />
                    </div>
                  )}
                  <span className='font-medium'>{product.name}</span>
                </div>
              </TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>{formatCurrency(product.cost)}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.reorderPoint}</TableCell>
              <TableCell>
                {format(new Date(product.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  variant='outline'
                  size='sm'
                  nativeButton={false}
                  render={<Link href={`/dashboard/products/${product.id}`} />}
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

export default ProductsTable;
