import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, Building2, Tags } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { useAuth } from '@/features/auth/useAuth';
import type { AppRole } from '@/features/auth/types';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: AppRole[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/users', label: 'Utilisateurs', icon: Users, roles: ['ADMINISTRATOR', 'MANAGER'] },
  { to: '/organization', label: 'Organisation', icon: Building2, roles: ['ADMINISTRATOR', 'MANAGER'] },
  { to: '/catalog', label: 'Catégories & tags', icon: Tags, roles: ['ADMINISTRATOR', 'MANAGER', 'TECHNICIAN'] },
];

export function Sidebar() {
  const { hasAnyRole } = useAuth();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
          IT
        </div>
        <span className="text-sm font-semibold text-text-primary">IT Desk</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.filter((item) => !item.roles || hasAnyRole(item.roles)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors',
                'hover:bg-hover hover:text-brand-dark',
                isActive && 'bg-hover text-brand-dark',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-5 py-4 text-xs text-text-secondary">
        Version 1.0.0
      </div>
    </aside>
  );
}
