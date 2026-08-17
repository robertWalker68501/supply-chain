import Link from 'next/link';

import { getWarehouses } from '@/app/(dashboard)/dashboard/warehouse/actions/warehouse';
import WarehousesTable from '@/components/warehouse/WarehousesTable';
import { Button } from '@/components/ui/button';

const WarehousesPage = async () => {
  const result = await getWarehouses();

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Warehouses</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
      </div>
    );
  }

  return (
    <div className='grid w-full max-w-6xl gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-3xl font-bold'>Warehouses</h1>
        <Button
          nativeButton={false}
          render={<Link href='/dashboard/warehouse/create' />}
        >
          Create warehouse
        </Button>
      </div>
      <WarehousesTable warehouses={result.data} />
    </div>
  );
};

export default WarehousesPage;
