import { useState } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '@/shared/ui/SearchBar';
import { Avatar } from '@/shared/ui/Avatar';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useAuth } from '@/features/auth/useAuth';

export function Navbar() {
  const { identity, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim().length > 1) {
      navigate(`/tickets?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-navbar px-6">
      <SearchBar value={search} onChange={handleSearch} placeholder="Rechercher un ticket, une référence…" className="w-96" />

      <div className="flex items-center gap-3">
        <NotificationBell />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((current) => !current)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-surface"
          >
            <Avatar name={identity?.fullName || identity?.username || '?'} size="sm" />
            <span className="text-sm font-medium text-text-primary">{identity?.fullName || identity?.username}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-40 w-48 animate-fade-in rounded-lg border border-border bg-background-secondary shadow-popover">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-surface"
              >
                <UserIcon className="h-4 w-4" />
                Mon profil
              </button>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-sm text-error hover:bg-surface"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
