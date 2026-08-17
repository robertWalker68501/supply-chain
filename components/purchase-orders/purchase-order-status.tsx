import { Badge } from '@/components/ui/badge';
import {
  purchaseOrderStatusOptions,
  type PurchaseOrderStatusValue,
} from '@/lib/schemas/PurchaseOrderSchema';
import { cn } from '@/lib/utils';

const statusClassNames: Record<PurchaseOrderStatusValue, string> = {
  DRAFT: 'border-border bg-muted text-muted-foreground',
  ORDERED: 'bg-blue-600 text-white dark:bg-blue-500',
  PARTIAL: 'bg-amber-500 text-white dark:bg-amber-500',
  RECEIVED: 'bg-green-600 text-white dark:bg-green-600',
  CANCELLED: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
};

export function getPurchaseOrderStatusLabel(status: PurchaseOrderStatusValue) {
  return (
    purchaseOrderStatusOptions.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function PurchaseOrderStatusBadge({
  status,
}: {
  status: PurchaseOrderStatusValue;
}) {
  return (
    <Badge
      variant='outline'
      className={cn('border-transparent', statusClassNames[status])}
    >
      {getPurchaseOrderStatusLabel(status)}
    </Badge>
  );
}
