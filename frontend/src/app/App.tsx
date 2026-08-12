import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from '@/shared/ui/Toast';
import { router } from './router';

export function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>
  );
}
