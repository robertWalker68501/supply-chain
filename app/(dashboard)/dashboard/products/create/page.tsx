import CreateProductForm from '@/components/products/CreateProductForm';

const CreateProductPage = () => {
  return (
    <div className='grid w-full gap-6'>
      <div className='grid gap-1'>
        <h1 className='text-3xl font-bold'>Create Product</h1>
        <p className='text-muted-foreground text-sm'>
          Add a catalog item you can include on purchase order lines.
        </p>
      </div>
      <CreateProductForm />
    </div>
  );
};

export default CreateProductPage;
