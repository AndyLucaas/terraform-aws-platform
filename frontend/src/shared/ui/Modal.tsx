import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'w-full animate-dialog-in rounded-lg bg-background-secondary shadow-popover',
          SIZE_CLASSES[size],
        )}
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-text-secondary">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-secondary transition-colors hover:bg-surface"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
