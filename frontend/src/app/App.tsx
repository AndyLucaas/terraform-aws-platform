import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from '@/shared/ui/Toast';
import { AuthProvider } from '@/features/auth/AuthContext';
import { router } from './router';

export function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
