export interface NotificationDto {
  id: number;
  type: 'TICKET_ASSIGNED' | 'TICKET_STATUS_CHANGED' | 'TICKET_COMMENTED' | 'TICKET_DUE_SOON';
  title: string;
  message: string;
  ticketId?: number;
  ticketReference?: string;
  read: boolean;
  createdAt: string;
}
