'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';

import {
  createVendor,
  deleteVendor,
  updateVendor,
  type VendorDetail,
} from '@/app/(dashboard)/dashboard/vendors/actions/vendors';
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton';
import { FormFieldControl } from '@/components/form-fields/FormFieldControl';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldGroup } from '@/components/ui/field';
import { toast } from '@/components/ui/toast';
import {
  createVendorSchema,
  type CreateVendorInput,
} from '@/lib/schemas/VendorSchema';

const emptyValues: CreateVendorInput = {
  name: '',
  slug: '',
  email: '',
  phone: '',
  notes: '',
};

const CreateVendorForm = ({ vendor }: { vendor?: VendorDetail }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(vendor);
  const defaultValues: CreateVendorInput = vendor
    ? {
        name: vendor.name,
        slug: vendor.slug,
        email: vendor.email,
        phone: vendor.phone,
        notes: vendor.notes,
      }
    : emptyValues;

  const form = useForm<CreateVendorInput>({
    resolver: zodResolver(createVendorSchema),
    defaultValues,
  });

  const onSubmit = (data: CreateVendorInput) => {
    startTransition(async () => {
      const result = vendor
        ? await updateVendor(vendor.id, data)
        : await createVendor(data);

      if (!result.success) {
        toast.add({
          type: 'error',
          title: isEditing
            ? 'Failed to update vendor'
            : 'Failed to create vendor',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        title: isEditing ? 'Vendor updated' : 'Vendor created',
        description: isEditing
          ? `${result.data.name} was updated successfully.`
          : `${result.data.name} was created successfully.`,
      });
      router.push('/dashboard/vendors');
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!vendor) return;

    startTransition(async () => {
      const result = await deleteVendor(vendor.id);

      if (!result.success) {
        toast.add({
          type: 'error',
          title: 'Failed to delete vendor',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Vendor deleted',
        description: `${result.data.name} was deleted successfully.`,
      });
      router.push('/dashboard/vendors');
      router.refresh();
    });
  };

  return (
    <form
      id={isEditing ? 'edit-vendor-form' : 'create-vendor-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      className='grid w-full gap-6'
    >
      <Card>
        <CardHeader>
          <CardTitle>Vendor details</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update this supplier. Leave the slug blank to generate a new one from the name.'
              : 'Add the supplier you buy from. A URL slug is generated from the name if you leave that field blank.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className='grid gap-6 md:grid-cols-2'>
              <FormFieldControl
                control={form.control}
                name='name'
                label='Name'
                type='text'
                required
                placeholder='Acme Supplies'
              />
              <FormFieldControl
                control={form.control}
                name='slug'
                label='Slug'
                type='text'
                placeholder='Leave blank to auto-generate'
                description='Optional. Lowercase letters, numbers, and hyphens only.'
              />
              <FormFieldControl
                control={form.control}
                name='email'
                label='Email'
                type='email'
                placeholder='purchasing@example.com'
              />
              <FormFieldControl
                control={form.control}
                name='phone'
                label='Phone'
                type='tel'
                placeholder='(555) 555-5555'
              />
            </div>
            <FormFieldControl
              control={form.control}
              name='notes'
              label='Notes'
              type='textarea'
              placeholder='Payment terms, contacts, or other details'
              rows={4}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              nativeButton={false}
              render={<Link href='/dashboard/vendors' />}
              disabled={isPending}
            >
              Cancel
            </Button>
            {vendor ? (
              <ConfirmDeleteButton
                label='Delete vendor'
                description={`This will permanently delete ${vendor.name}. You cannot delete a vendor that is used on a purchase order.`}
                disabled={isPending}
                isPending={isPending}
                onConfirm={onDelete}
              />
            ) : null}
          </div>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset(defaultValues)}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              form={isEditing ? 'edit-vendor-form' : 'create-vendor-form'}
              type='submit'
              disabled={isPending}
            >
              {isPending ? (
                <Loader
                  size={16}
                  className='animate-spin'
                />
              ) : isEditing ? (
                'Save changes'
              ) : (
                'Create vendor'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateVendorForm;
