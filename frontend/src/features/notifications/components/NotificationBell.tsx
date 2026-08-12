import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/shared/lib/cn';
import { Loader } from '@/shared/ui/Loader';
import { EmptyState } from '@/shared/ui/EmptyState';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from '../hooks';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: unreadCount } = useUnreadNotificationsCount();
  const { data: page, isLoading } = useNotifications(0);
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {Boolean(unreadCount) && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-80 animate-fade-in rounded-lg border border-border bg-background-secondary shadow-popover">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-text-primary">Notifications</span>
            <button
              onClick={() => markAllAsRead.mutate()}
              className="flex items-center gap-1 text-xs text-brand hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Tout marquer comme lu
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <Loader label="Chargement…" className="py-8" />
            ) : page && page.content.length > 0 ? (
              page.content.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => markAsRead.mutate(notification.id)}
                  className={cn(
                    'flex w-full flex-col gap-0.5 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface',
                    !notification.read && 'bg-hover/50',
                  )}
                >
                  <span className="text-xs font-medium text-text-primary">{notification.title}</span>
                  <span className="text-xs text-text-secondary">{notification.message}</span>
                  <span className="mt-0.5 text-[11px] text-text-secondary">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                  </span>
                </button>
              ))
            ) : (
              <EmptyState title="Aucune notification" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
