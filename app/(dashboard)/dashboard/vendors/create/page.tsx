import CreateVendorForm from '@/components/vendors/CreateVendorForm';

const CreateVendorPage = () => {
  return (
    <div className='grid w-full gap-6'>
      <div className='grid gap-1'>
        <h1 className='text-3xl font-bold'>Create Vendor</h1>
        <p className='text-muted-foreground text-sm'>
          Add a supplier you can select when creating a purchase order.
        </p>
      </div>
      <CreateVendorForm />
    </div>
  );
};

export default CreateVendorPage;
