import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est obligatoire"),
  password: z.string().min(1, 'Le mot de passe est obligatoire'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est obligatoire'),
    newPassword: z.string().min(10, 'Le mot de passe doit contenir au moins 10 caractères'),
    confirmPassword: z.string().min(1, 'La confirmation est obligatoire'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Les deux mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
