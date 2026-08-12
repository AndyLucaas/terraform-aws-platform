import { format } from 'date-fns';
import { EmptyState } from '@/shared/ui/EmptyState';
import type { TicketHistoryEntry } from '../types';

const FIELD_LABELS: Record<string, string> = {
  title: 'Titre',
  status: 'Statut',
  priority: 'Priorité',
  assignee: 'Assigné à',
};

export function HistoryTimeline({ entries }: { entries: TicketHistoryEntry[] }) {
  if (entries.length === 0) {
    return <EmptyState title="Aucun historique" description="Les modifications du ticket apparaîtront ici." />;
  }

  return (
    <ol className="flex flex-col gap-4">
      {entries.map((entry) => (
        <li key={entry.id} className="flex gap-3 text-sm">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <div>
            <p className="text-text-primary">
              <span className="font-medium">{entry.changedBy.fullName}</span> a modifié{' '}
              <span className="font-medium">{FIELD_LABELS[entry.fieldName] ?? entry.fieldName}</span> :{' '}
              <span className="text-text-secondary">{entry.oldValue ?? '—'}</span> →{' '}
              <span className="text-text-secondary">{entry.newValue ?? '—'}</span>
            </p>
            <span className="text-xs text-text-secondary">{format(new Date(entry.createdAt), 'dd/MM/yyyy à HH:mm')}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
