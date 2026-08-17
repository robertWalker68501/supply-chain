import Link from 'next/link';

import { getPurchaseOrders } from '@/app/(dashboard)/dashboard/purchase-orders/actions/purchase-orders';
import PurchaseOrdersTable from '@/components/purchase-orders/PurchaseOrdersTable';
import { Button } from '@/components/ui/button';

const PurchaseOrdersPage = async () => {
  const result = await getPurchaseOrders();

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Purchase Orders</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
      </div>
    );
  }

  return (
    <div className='grid w-full max-w-6xl gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-3xl font-bold'>Purchase Orders</h1>
        <Button
          nativeButton={false}
          render={<Link href='/dashboard/purchase-orders/create' />}
        >
          Create purchase order
        </Button>
      </div>
      <PurchaseOrdersTable purchaseOrders={result.data} />
    </div>
  );
};

export default PurchaseOrdersPage;
