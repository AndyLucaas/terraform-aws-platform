import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layout/AppLayout';
import { RoleGuard } from './RoleGuard';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { TicketListPage } from '@/features/tickets/pages/TicketListPage';
import { TicketDetailPage } from '@/features/tickets/pages/TicketDetailPage';
import { TicketFormPage } from '@/features/tickets/pages/TicketFormPage';
import { UsersPage } from '@/features/users/pages/UsersPage';
import { OrganizationPage } from '@/features/organization/pages/OrganizationPage';
import { CatalogPage } from '@/features/catalog/pages/CatalogPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tickets', element: <TicketListPage /> },
      { path: 'tickets/new', element: <TicketFormPage /> },
      { path: 'tickets/:id', element: <TicketDetailPage /> },
      { path: 'tickets/:id/edit', element: <TicketFormPage /> },
      {
        path: 'users',
        element: (
          <RoleGuard roles={['ADMINISTRATOR', 'MANAGER']}>
            <UsersPage />
          </RoleGuard>
        ),
      },
      {
        path: 'organization',
        element: (
          <RoleGuard roles={['ADMINISTRATOR', 'MANAGER']}>
            <OrganizationPage />
          </RoleGuard>
        ),
      },
      {
        path: 'catalog',
        element: (
          <RoleGuard roles={['ADMINISTRATOR', 'MANAGER', 'TECHNICIAN']}>
            <CatalogPage />
          </RoleGuard>
        ),
      },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);
