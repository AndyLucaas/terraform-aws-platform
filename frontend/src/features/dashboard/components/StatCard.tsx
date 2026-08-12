import type { LucideIcon } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { cn } from '@/shared/lib/cn';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: 'brand' | 'success' | 'error' | 'warning' | 'info';
}

const TONE_CLASSES = {
  brand: 'bg-brand/10 text-brand',
  success: 'bg-success/10 text-success',
  error: 'bg-error/10 text-error',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
};

export function StatCard({ icon: Icon, label, value, tone = 'brand' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-md', TONE_CLASSES[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-text-secondary">{label}</p>
        <p className="text-xl font-semibold text-text-primary">{value}</p>
      </div>
    </Card>
  );
}
