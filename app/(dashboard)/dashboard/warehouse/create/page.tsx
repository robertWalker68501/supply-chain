import CreateWarehouseForm from '@/components/warehouse/CreateWarehouseForm';

const CreateWarehousePage = () => {
  return (
    <div className='grid w-full gap-6'>
      <div className='grid gap-1'>
        <h1 className='text-3xl font-bold'>Create Warehouse</h1>
        <p className='text-muted-foreground text-sm'>
          Add a receiving location you can select when creating a purchase
          order.
        </p>
      </div>
      <CreateWarehouseForm />
    </div>
  );
};

export default CreateWarehousePage;
