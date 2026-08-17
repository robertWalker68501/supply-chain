'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import Link from 'next/link';

import {
  createWarehouse,
  deleteWarehouse,
  updateWarehouse,
  type WarehouseDetail,
} from '@/app/(dashboard)/dashboard/warehouse/actions/warehouse';
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
  createWarehouseSchema,
  type CreateWarehouseInput,
} from '@/lib/schemas/WarehouseSchema';

const emptyValues: CreateWarehouseInput = {
  name: '',
};

const CreateWarehouseForm = ({
  warehouse,
}: {
  warehouse?: WarehouseDetail;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(warehouse);
  const defaultValues: CreateWarehouseInput = warehouse
    ? { name: warehouse.name }
    : emptyValues;

  const form = useForm<CreateWarehouseInput>({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues,
  });

  const onSubmit = (data: CreateWarehouseInput) => {
    startTransition(async () => {
      const result = warehouse
        ? await updateWarehouse(warehouse.id, data)
        : await createWarehouse(data);

      if (!result.success) {
        toast.add({
          type: 'error',
          title: warehouse
            ? 'Failed to update warehouse'
            : 'Failed to create warehouse',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        title: warehouse ? 'Warehouse updated' : 'Warehouse created',
        description: warehouse
          ? `${result.data.name} was updated successfully.`
          : `${result.data.name} was created successfully.`,
      });
      router.push('/dashboard/warehouse');
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!warehouse) return;

    startTransition(async () => {
      const result = await deleteWarehouse(warehouse.id);

      if (!result.success) {
        toast.add({
          type: 'error',
          title: 'Failed to delete warehouse',
          description: result.error,
        });
        return;
      }

      toast.add({
        type: 'success',
        title: 'Warehouse deleted',
        description: `${result.data.name} was deleted successfully.`,
      });
      router.push('/dashboard/warehouse');
      router.refresh();
    });
  };

  return (
    <form
      id={isEditing ? 'edit-warehouse-form' : 'create-warehouse-form'}
      onSubmit={form.handleSubmit(onSubmit)}
      className='grid w-full gap-6'
    >
      <Card>
        <CardHeader>
          <CardTitle>Warehouse details</CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update the location where incoming purchase orders should be received.'
              : 'Name the location where incoming purchase orders should be received.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FormFieldControl
              control={form.control}
              name='name'
              label='Name'
              type='text'
              required
              placeholder='Main warehouse'
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className='justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <Button
              type='button'
              variant='outline'
              nativeButton={false}
              render={<Link href='/dashboard/warehouse' />}
              disabled={isPending}
            >
              Cancel
            </Button>
            {warehouse ? (
              <ConfirmDeleteButton
                label='Delete warehouse'
                description={`This will permanently delete ${warehouse.name}. You cannot delete a warehouse that is used on purchase orders or receipts.`}
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
              form={isEditing ? 'edit-warehouse-form' : 'create-warehouse-form'}
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
                'Create warehouse'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateWarehouseForm;
