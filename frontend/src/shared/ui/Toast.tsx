import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

type ToastTone = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastContextValue {
  push: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICON: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-info',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...toast, id }]);
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts((current) => current.filter((item) => item.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = TONE_ICON[toast.tone];
          return (
            <div
              key={toast.id}
              className="animate-fade-in flex items-start gap-2.5 rounded-lg border border-border bg-background-secondary p-3 shadow-popover"
            >
              <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', TONE_CLASSES[toast.tone])} />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{toast.title}</p>
                {toast.description && <p className="mt-0.5 text-xs text-text-secondary">{toast.description}</p>}
              </div>
              <button onClick={() => dismiss(toast.id)} className="text-text-secondary hover:text-text-primary">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast doit être utilisé à l\'intérieur de ToastProvider');
  }
  return context;
}
