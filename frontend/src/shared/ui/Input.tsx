import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-9 w-full rounded-md border border-border bg-background-secondary px-3 text-sm text-text-primary',
            'placeholder:text-text-secondary focus-ring transition-colors',
            error && 'border-error',
            className,
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-error">{error}</span>
        ) : hint ? (
          <span className="text-xs text-text-secondary">{hint}</span>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';
