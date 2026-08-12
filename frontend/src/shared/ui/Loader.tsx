import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface LoaderProps {
  label?: string;
  fullHeight?: boolean;
  className?: string;
}

export function Loader({ label = 'Chargement…', fullHeight = false, className }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-text-secondary',
        fullHeight && 'h-64',
        className,
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin text-brand" />
      <span className="text-xs">{label}</span>
    </div>
  );
}
