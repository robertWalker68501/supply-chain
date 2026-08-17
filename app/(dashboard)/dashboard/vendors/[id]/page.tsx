import Link from 'next/link';

import { getVendor } from '@/app/(dashboard)/dashboard/vendors/actions/vendors';
import CreateVendorForm from '@/components/vendors/CreateVendorForm';

const EditVendorPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getVendor(id);

  if (!result.success) {
    return (
      <div className='grid gap-2'>
        <h1 className='text-3xl font-bold'>Edit Vendor</h1>
        <p className='text-destructive text-sm'>{result.error}</p>
        <Link
          href='/dashboard/vendors'
          className='text-sm underline underline-offset-4'
        >
          Back to vendors
        </Link>
      </div>
    );
  }

  return (
    <div className='grid w-full gap-6'>
      <div className='grid gap-1'>
        <h1 className='text-3xl font-bold'>Edit Vendor</h1>
        <p className='text-muted-foreground text-sm'>
          Update this supplier. Changes apply to new purchase orders that select
          it.
        </p>
      </div>
      <CreateVendorForm vendor={result.data} />
    </div>
  );
};

export default EditVendorPage;
