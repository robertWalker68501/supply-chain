'use client';

import { useEffect, useTransition } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

import {
  createPurchaseOrder,
  type PurchaseOrderFormOptions,
} from '@/app/(dashboard)/dashboard/purchase-orders/actions/purchase-orders';
import { FormFieldControl } from '@/components/form-fields/FormFieldControl';
import { RichTextEditorField } from '@/components/form-fields/editor';
import { formatCurrency } from '@/components/purchase-orders/purchase-order-status';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  createPurchaseOrderSchema,
  purchaseOrderStatusOptions,
  type CreatePurchaseOrderInput,
} from '@/lib/schemas/PurchaseOrderSchema';

const emptyLine: CreatePurchaseOrderInput['lines'][number] = {
  productId: '',
  description: '',
  quantityOrdered: '1',
  unitCost: '0',
};

const defaultValues: CreatePurchaseOrderInput = {
  number: '',
  vendorId: '',
  warehouseId: '',
  status: 'DRAFT',
  orderedAt: '',
  expectedAt: '',
  notes: '',
  lines: [emptyLine],
};

type CreatePurchaseOrderFormProps = {
  options: PurchaseOrderFormOptions;
};

const CreatePurchaseOrderForm = ({ options }: CreatePurchaseOrderFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const missingCatalog =
    options.vendors.length === 0 ||
    options.warehouses.length === 0 ||
    options.products.length === 0;

  const form = useForm<CreatePurchaseOrderInput>({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lines',
  });

  const watchedLines = useWatch({
    control: form.control,
    name: 'lines',
  });

  const orderTotal = (watchedLines ?? []).reduce((sum, line) => {
    const quantity = Number(line?.quantityOrdered) || 0;
    const unitCost = Number(line?.unitCost) || 0;
    return sum + quantity * unitCost;
  }, 0);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type !== 'change' || !name?.match(/^lines\.\d+\.productId$/)) {
        return;
      }

      const index = Number(name.split('.')[1]);
      const productId = value.lines?.[index]?.productId;
      const product = options.products.find((item) => item.value === productId);

      if (!product) return;

      const currentDescription = value.lines?.[index]?.description?.trim();

      form.setValue(`lines.${index}.unitCost`, product.cost.toFixed(2), {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (!currentDescription) {
        const productName = product.label.split(' — ').slice(1).join(' — ');
        form.setValue(`lines.${index}.description`, productName, {
          shouldDirty: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, options.products]);

  const onSubmit = (data: CreatePurchaseOrderInput) => {
    startTransition(async () => {
      const result = await createPurchaseOrder(data);

      if (!result.success) {
        toast.add({
          type: 'error',
          title: 'Failed to create purchase order',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Purchase order created',
        description: `${result.data.number} was created successfully.`,
      });
      router.push('/dashboard/purchase-orders');
      router.refresh();
    });
  };

  return (
    <form
      id='create-purchase-order-form'
      onSubmit={form.handleSubmit(onSubmit)}
      className='grid w-full gap-6'
    >
      {missingCatalog ? (
        <Alert>
          <AlertTitle>Catalog data is missing</AlertTitle>
          <AlertDescription>
            <p>
              Add at least one vendor, warehouse, and product before creating a
              purchase order.
            </p>
            <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1'>
              {options.vendors.length === 0 ? (
                <Link href='/dashboard/vendors/create'>Create vendor</Link>
              ) : null}
              {options.warehouses.length === 0 ? (
                <Link href='/dashboard/warehouse/create'>Create warehouse</Link>
              ) : null}
              {options.products.length === 0 ? (
                <Link href='/dashboard/products/create'>Create product</Link>
              ) : null}
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Order details</CardTitle>
          <CardDescription>
            Choose the vendor, destination warehouse, and dates for this order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className='grid gap-6 md:grid-cols-2'>
              <FormFieldControl
                control={form.control}
                name='number'
                label='Purchase order number'
                type='text'
                placeholder='Leave blank to auto-generate'
                description='Optional. A number such as PO-20260816-0001 is created if this is empty.'
              />
              <FormFieldControl
                control={form.control}
                name='status'
                label='Status'
                type='select'
                required
                options={[...purchaseOrderStatusOptions]}
              />
              <FormFieldControl
                control={form.control}
                name='vendorId'
                label='Vendor'
                type='select'
                required
                placeholder='Select a vendor'
                options={options.vendors}
              />
              <FormFieldControl
                control={form.control}
                name='warehouseId'
                label='Warehouse'
                type='select'
                required
                placeholder='Select a warehouse'
                options={options.warehouses}
              />
              <FormFieldControl
                control={form.control}
                name='orderedAt'
                label='Ordered date'
                type='date'
              />
              <FormFieldControl
                control={form.control}
                name='expectedAt'
                label='Expected date'
                type='date'
              />
            </div>
            <RichTextEditorField
              control={form.control}
              name='notes'
              label='Notes'
              description='Optional receiving instructions, vendor terms, or other details.'
              placeholder='Add notes for this purchase order...'
              preset='simple'
              height={280}
            />
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line items</CardTitle>
          <CardDescription>
            Add the products being ordered, quantities, and unit costs.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6'>
          {form.formState.errors.lines?.message ? (
            <p
              role='alert'
              className='text-destructive text-sm'
            >
              {form.formState.errors.lines.message}
            </p>
          ) : null}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className='grid gap-4 rounded-lg border p-4'
            >
              <div className='flex items-center justify-between gap-4'>
                <p className='text-sm font-medium'>Line {index + 1}</p>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  disabled={fields.length === 1 || isPending}
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                  Remove
                </Button>
              </div>

              <div className='grid gap-4 lg:grid-cols-2'>
                <FormFieldControl
                  control={form.control}
                  name={`lines.${index}.productId`}
                  label='Product'
                  type='select'
                  required
                  placeholder='Select a product'
                  options={options.products}
                />
                <FormFieldControl
                  control={form.control}
                  name={`lines.${index}.description`}
                  label='Description'
                  type='text'
                  placeholder='Optional line description'
                />
                <FormFieldControl
                  control={form.control}
                  name={`lines.${index}.quantityOrdered`}
                  label='Quantity'
                  type='number'
                  required
                  min={1}
                  step={1}
                  inputMode='numeric'
                />
                <FormFieldControl
                  control={form.control}
                  name={`lines.${index}.unitCost`}
                  label='Unit cost'
                  type='number'
                  required
                  min={0}
                  step={0.01}
                  inputMode='decimal'
                />
              </div>
            </div>
          ))}

          <div className='flex flex-wrap items-center justify-between gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => append(emptyLine)}
              disabled={isPending}
            >
              <Plus />
              Add line
            </Button>
            <p className='text-sm font-medium'>
              Order total: {formatCurrency(orderTotal)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardFooter className='justify-between gap-4'>
          <Button
            type='button'
            variant='outline'
            nativeButton={false}
            render={<Link href='/dashboard/purchase-orders' />}
            disabled={isPending}
          >
            Cancel
          </Button>
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
              form='create-purchase-order-form'
              type='submit'
              disabled={isPending || missingCatalog}
            >
              {isPending ? (
                <Loader
                  size={16}
                  className='animate-spin'
                />
              ) : (
                'Create purchase order'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreatePurchaseOrderForm;
