import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Pagination } from '@/shared/ui/Pagination';
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable';
import { Avatar } from '@/shared/ui/Avatar';
import { useTickets } from '../hooks';
import { TicketFiltersBar } from '../components/TicketFiltersBar';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import type { TicketFilters, TicketSummary } from '../types';

export function TicketListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<TicketFilters>({ search: searchParams.get('search') ?? undefined });
  const [page, setPage] = useState(0);

  const { data, isLoading } = useTickets(filters, page);

  const columns: DataTableColumn<TicketSummary>[] = [
    { key: 'reference', header: 'Référence', render: (ticket) => <span className="font-mono text-xs">{ticket.reference}</span> },
    { key: 'title', header: 'Titre', render: (ticket) => <span className="font-medium">{ticket.title}</span> },
    { key: 'status', header: 'Statut', render: (ticket) => <StatusBadge status={ticket.status} /> },
    { key: 'priority', header: 'Priorité', render: (ticket) => <PriorityBadge priority={ticket.priority} /> },
    {
      key: 'assignee',
      header: 'Assigné à',
      render: (ticket) =>
        ticket.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar name={ticket.assignee.fullName} size="sm" />
            <span>{ticket.assignee.fullName}</span>
          </div>
        ) : (
          <span className="text-text-secondary">Non assigné</span>
        ),
    },
    {
      key: 'dueDate',
      header: 'Échéance',
      render: (ticket) => (ticket.dueDate ? format(new Date(ticket.dueDate), 'dd/MM/yyyy') : '—'),
    },
    {
      key: 'createdAt',
      header: 'Créé le',
      render: (ticket) => format(new Date(ticket.createdAt), 'dd/MM/yyyy'),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Tickets</h1>
          <p className="text-sm text-text-secondary">Suivez et gérez l'ensemble des demandes IT</p>
        </div>
        <Button onClick={() => navigate('/tickets/new')}>
          <Plus className="h-4 w-4" />
          Nouveau ticket
        </Button>
      </div>

      <Card>
        <div className="border-b border-border px-5 py-4">
          <TicketFiltersBar filters={filters} onChange={(next) => { setFilters(next); setPage(0); }} />
        </div>

        <DataTable
          columns={columns}
          data={data?.content ?? []}
          isLoading={isLoading}
          getRowKey={(ticket) => ticket.id}
          onRowClick={(ticket) => navigate(`/tickets/${ticket.id}`)}
          emptyTitle="Aucun ticket trouvé"
          emptyDescription="Ajustez vos filtres ou créez un nouveau ticket."
        />

        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onPageChange={setPage}
          />
        )}
      </Card>
    </div>
  );
}
