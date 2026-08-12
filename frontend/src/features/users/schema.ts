import { z } from 'zod';

export const userFormSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est obligatoire"),
  email: z.string().min(1, "L'email est obligatoire").email('Format invalide'),
  firstName: z.string().min(1, 'Le prénom est obligatoire'),
  lastName: z.string().min(1, 'Le nom est obligatoire'),
  phoneNumber: z.string().optional(),
  jobTitle: z.string().optional(),
  departmentId: z.coerce.number().optional(),
  teamId: z.coerce.number().optional(),
  roleCodes: z.array(z.enum(['ADMINISTRATOR', 'TECHNICIAN', 'MANAGER', 'USER'])).min(1, 'Au moins un rôle est requis'),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
