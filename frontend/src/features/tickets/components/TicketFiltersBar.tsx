import { SearchBar } from '@/shared/ui/SearchBar';
import { Select } from '@/shared/ui/Select';
import { useTicketPriorities, useTicketStatuses } from '../hooks';
import type { TicketFilters } from '../types';

interface TicketFiltersBarProps {
  filters: TicketFilters;
  onChange: (filters: TicketFilters) => void;
}

export function TicketFiltersBar({ filters, onChange }: TicketFiltersBarProps) {
  const { data: statuses } = useTicketStatuses();
  const { data: priorities } = useTicketPriorities();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchBar
        value={filters.search ?? ''}
        onChange={(search) => onChange({ ...filters, search })}
        placeholder="Rechercher par titre ou référence…"
        className="w-72"
      />
      <Select
        className="w-44"
        placeholder="Tous les statuts"
        value={filters.statusId?.toString() ?? ''}
        onChange={(event) =>
          onChange({ ...filters, statusId: event.target.value ? Number(event.target.value) : undefined })
        }
        options={(statuses ?? []).map((status) => ({ value: status.id.toString(), label: status.label }))}
      />
      <Select
        className="w-44"
        placeholder="Toutes les priorités"
        value={filters.priorityId?.toString() ?? ''}
        onChange={(event) =>
          onChange({ ...filters, priorityId: event.target.value ? Number(event.target.value) : undefined })
        }
        options={(priorities ?? []).map((priority) => ({ value: priority.id.toString(), label: priority.label }))}
      />
    </div>
  );
}
