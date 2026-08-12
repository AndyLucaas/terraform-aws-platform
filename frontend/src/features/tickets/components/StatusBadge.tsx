import { Badge } from '@/shared/ui/Badge';
import type { TicketStatus } from '../types';

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge colorHex={status.colorHex}>{status.label}</Badge>;
}
