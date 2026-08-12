export interface UserSummary {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface TicketStatus {
  id: number;
  code: string;
  label: string;
  closedState: boolean;
  colorHex: string;
}

export interface TicketPriority {
  id: number;
  code: string;
  label: string;
  slaHours?: number;
  colorHex: string;
}

export interface Category {
  id: number;
  name: string;
  parentId?: number;
  subCategories: Category[];
}

export interface Tag {
  id: number;
  name: string;
  colorHex?: string;
}

export interface TicketSummary {
  id: number;
  reference: string;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: UserSummary;
  assignee?: UserSummary;
  dueDate?: string;
  createdAt: string;
}

export interface TicketDetail {
  id: number;
  reference: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: Category;
  requester: UserSummary;
  assignee?: UserSummary;
  teamId?: number;
  teamName?: string;
  tags: Tag[];
  dueDate?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketFilters {
  search?: string;
  statusId?: number;
  priorityId?: number;
  categoryId?: number;
  assigneeId?: number;
  requesterId?: number;
  teamId?: number;
  tagId?: number;
  overdue?: boolean;
}

export interface TicketCreatePayload {
  title: string;
  description: string;
  priorityId: number;
  categoryId?: number;
  assigneeId?: number;
  teamId?: number;
  dueDate?: string;
  tagIds?: number[];
}

export interface TicketUpdatePayload extends TicketCreatePayload {
  statusId: number;
}

export interface Comment {
  id: number;
  author: UserSummary;
  content: string;
  internal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: number;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  uploadedById: number;
  uploadedByName: string;
  createdAt: string;
}

export interface TicketHistoryEntry {
  id: number;
  changedBy: UserSummary;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}
