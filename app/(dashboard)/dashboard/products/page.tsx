import Link from 'next/link';

import { getProducts } from '@/app/(dashboard)/dashboard/products/actions/products';
import ProductsTable from '@/components/products/ProductsTable';
import { Button } from '@/components/ui/button';

const ProductsPage = async () => {
  const result = await getProducts();

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
      </div>
    );
  }

  return (
    <div className='grid w-full max-w-6xl gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <Button
          nativeButton={false}
          render={<Link href='/dashboard/products/create' />}
        >
          Create product
        </Button>
      </div>
      <ProductsTable products={result.data} />
    </div>
  );
};

export default ProductsPage;
