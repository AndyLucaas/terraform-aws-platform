import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table';
import { Loader } from './Loader';
import { EmptyState } from './EmptyState';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyTitle = 'Aucun résultat',
  emptyDescription,
  getRowKey,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return <Loader fullHeight label="Chargement des données…" />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.key} className={column.className}>
              {column.header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={getRowKey(row)}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? 'cursor-pointer' : undefined}
          >
            {columns.map((column) => (
              <TableCell key={column.key} className={column.className}>
                {column.render(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
