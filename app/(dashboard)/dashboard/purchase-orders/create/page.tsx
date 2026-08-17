import { getPurchaseOrderFormOptions } from '@/app/(dashboard)/dashboard/purchase-orders/actions/purchase-orders';
import CreatePurchaseOrderForm from '@/components/purchase-orders/CreatePurchaseOrderForm';

const CreatePurchaseOrderPage = async () => {
  const result = await getPurchaseOrderFormOptions();

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Create Purchase Order</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
      </div>
    );
  }

  return (
    <div className='grid w-full gap-6'>
      <div className='grid gap-1'>
        <h1 className='text-3xl font-bold'>Create Purchase Order</h1>
        <p className='text-muted-foreground text-sm'>
          Enter vendor, warehouse, and line item details to create a purchase
          order.
        </p>
      </div>
      <CreatePurchaseOrderForm options={result.data} />
    </div>
  );
};

export default CreatePurchaseOrderPage;
