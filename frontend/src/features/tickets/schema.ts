import { z } from 'zod';

export const ticketFormSchema = z.object({
  title: z.string().min(1, 'Le titre est obligatoire').max(200, 'Le titre ne doit pas dépasser 200 caractères'),
  description: z.string().min(1, 'La description est obligatoire'),
  priorityId: z.coerce.number({ invalid_type_error: 'La priorité est obligatoire' }),
  statusId: z.coerce.number().optional(),
  categoryId: z.coerce.number().optional(),
  assigneeId: z.coerce.number().optional(),
  dueDate: z.string().optional(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
