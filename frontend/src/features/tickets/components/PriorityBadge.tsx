import { Badge } from '@/shared/ui/Badge';
import type { TicketPriority } from '../types';

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <Badge colorHex={priority.colorHex}>{priority.label}</Badge>;
}
