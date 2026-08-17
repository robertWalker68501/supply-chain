import Link from 'next/link';

import { getProduct } from '@/app/(dashboard)/dashboard/products/actions/products';
import CreateProductForm from '@/components/products/CreateProductForm';

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getProduct(id);

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Edit Product</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
        <Link
          href='/dashboard/products'
          className='text-sm underline underline-offset-4'
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className='grid w-full gap-6'>
      <div className='grid gap-1'>
        <h1 className='text-3xl font-bold'>Edit Product</h1>
        <p className='text-muted-foreground text-sm'>
          Update this catalog item. Changes apply to new purchase order lines
          that select it.
        </p>
      </div>
      <CreateProductForm product={result.data} />
    </div>
  );
};

export default EditProductPage;
