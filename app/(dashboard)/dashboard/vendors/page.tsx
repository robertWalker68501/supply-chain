import Link from 'next/link';

import { getVendors } from '@/app/(dashboard)/dashboard/vendors/actions/vendors';
import VendorsTable from '@/components/vendors/VendorsTable';
import { Button } from '@/components/ui/button';

const VendorsPage = async () => {
  const result = await getVendors();

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Vendors</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
      </div>
    );
  }

  return (
    <div className='grid w-full max-w-6xl gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-3xl font-bold'>Vendors</h1>
        <Button
          nativeButton={false}
          render={<Link href='/dashboard/vendors/create' />}
        >
          Create vendor
        </Button>
      </div>
      <VendorsTable vendors={result.data} />
    </div>
  );
};

export default VendorsPage;
