import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

type BadgeTone = 'neutral' | 'success' | 'error' | 'warning' | 'info' | 'brand';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  colorHex?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-surface text-text-secondary',
  success: 'bg-success/10 text-success',
  error: 'bg-error/10 text-error',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-info/10 text-info',
  brand: 'bg-brand/10 text-brand',
};

export function Badge({ className, tone = 'neutral', colorHex, style, children, ...props }: BadgeProps) {
  const customStyle = colorHex
    ? { backgroundColor: `${colorHex}1A`, color: colorHex, ...style }
    : style;

  return (
    <span
      style={customStyle}
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        !colorHex && TONE_CLASSES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
