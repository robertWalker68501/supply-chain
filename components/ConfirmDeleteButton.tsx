'use client';

import { Loader } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type ConfirmDeleteButtonProps = {
  label: string;
  description: string;
  disabled?: boolean;
  isPending?: boolean;
  onConfirm: () => void;
};

const ConfirmDeleteButton = ({
  label,
  description,
  disabled = false,
  isPending = false,
  onConfirm,
}: ConfirmDeleteButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type='button'
            variant='destructive'
            disabled={disabled || isPending}
          />
        }
      >
        {isPending ? (
          <Loader
            size={16}
            className='animate-spin'
          />
        ) : (
          label
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{label}?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type='button'
            variant='destructive'
            disabled={isPending}
            onClick={onConfirm}
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteButton;
