import Link from 'next/link';

import { getWarehouse } from '@/app/(dashboard)/dashboard/warehouse/actions/warehouse';
import CreateWarehouseForm from '@/components/warehouse/CreateWarehouseForm';

const EditWarehousePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getWarehouse(id);

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Edit Warehouse</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
        <Link
          href='/dashboard/warehouse'
          className='text-sm underline underline-offset-4'
        >
          Back to warehouses
        </Link>
      </div>
    );
  }

  return (
    <div className='grid w-full gap-6'>
      <div className='grid gap-1'>
        <h1 className='text-3xl font-bold'>Edit Warehouse</h1>
        <p className='text-muted-foreground text-sm'>
          Update this receiving location. Changes apply to new purchase orders
          that select it.
        </p>
      </div>
      <CreateWarehouseForm warehouse={result.data} />
    </div>
  );
};

export default EditWarehousePage;
