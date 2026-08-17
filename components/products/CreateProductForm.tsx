'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';

import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductDetail,
} from '@/app/(dashboard)/dashboard/products/actions/products';
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton';
import { FormFieldControl } from '@/components/form-fields/FormFieldControl';
import { TagInputField } from '@/components/form-fields/TagInputField';
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
  createProductSchema,
  type CreateProductInput,
} from '@/lib/schemas/ProductSchema';

const emptyValues: CreateProductInput = {
  name: '',
  sku: '',
  slug: '',
  description: '',
  unit: 'EA',
  cost: '',
  price: '',
  reorderPoint: '0',
  leadTimeDays: '0',
  tags: [],
};

const CreateProductForm = ({ product }: { product?: ProductDetail }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(product);
  const defaultValues: CreateProductInput = product
    ? {
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        description: product.description,
        unit: product.unit,
        cost: product.cost,
        price: product.price,
        reorderPoint: product.reorderPoint,
        leadTimeDays: product.leadTimeDays,
        tags: product.tags,
      }
    : emptyValues;

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });

  const onSubmit = (data: CreateProductInput) => {
    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data);

      if (!result.success) {
        toast.add({
          type: 'error',
          title: product
            ? 'Failed to update product'
            : 'Failed to create product',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        title: product ? 'Product updated' : 'Product created',
        description: product
          ? `${result.data.sku} — ${result.data.name} was updated successfully.`
          : `${result.data.sku} — ${result.data.name} was created successfully.`,
      });
      router.push('/dashboard/products');
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!product) return;

    startTransition(async () => {
      const result = await deleteProduct(product.id);

      if (!result.success) {
        toast.add({
          type: 'error',
          title: 'Failed to delete product',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Product deleted',
        description: `${result.data.sku} — ${result.data.name} was deleted successfully.`,
      });
      router.push('/dashboard/products');
      router.refresh();
    });
  };

  return (
    <form
      id={isEditing ? 'edit-product-form' : 'create-product-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      className='grid w-full gap-6'
    >
      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update this catalog item. Leave the slug blank to generate a new one from the name.'
              : 'Add a catalog item that can be ordered from a vendor. A URL slug is generated from the name if you leave that field blank.'}
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
                placeholder='Widget A'
              />
              <FormFieldControl
                control={form.control}
                name='sku'
                label='SKU'
                type='text'
                required
                placeholder='WID-001'
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
                name='unit'
                label='Unit'
                type='text'
                required
                placeholder='EA'
                description='Unit of measure, such as EA, BOX, or CS.'
              />
              <FormFieldControl
                control={form.control}
                name='cost'
                label='Cost'
                type='number'
                required
                min={0}
                step={0.01}
                inputMode='decimal'
              />
              <FormFieldControl
                control={form.control}
                name='price'
                label='Price'
                type='number'
                required
                min={0}
                step={0.01}
                inputMode='decimal'
              />
              <FormFieldControl
                control={form.control}
                name='reorderPoint'
                label='Reorder point'
                type='number'
                required
                min={0}
                step={1}
                inputMode='numeric'
              />
              <FormFieldControl
                control={form.control}
                name='leadTimeDays'
                label='Lead time (days)'
                type='number'
                required
                min={0}
                step={1}
                inputMode='numeric'
              />
            </div>
            <FormFieldControl
              control={form.control}
              name='description'
              label='Description'
              type='textarea'
              placeholder='Optional product description'
              rows={4}
            />
            <TagInputField
              control={form.control}
              name='tags'
              label='Tags'
              description='Optional. Press Enter or comma to add a tag.'
              placeholder='Type a tag and press Enter'
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              nativeButton={false}
              render={<Link href='/dashboard/products' />}
              disabled={isPending}
            >
              Cancel
            </Button>
            {product ? (
              <ConfirmDeleteButton
                label='Delete product'
                description={`This will permanently delete ${product.name}. You cannot delete a product that is used on purchase orders, receipts, or stock movements.`}
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
              form={isEditing ? 'edit-product-form' : 'create-product-form'}
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
                'Create product'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateProductForm;
