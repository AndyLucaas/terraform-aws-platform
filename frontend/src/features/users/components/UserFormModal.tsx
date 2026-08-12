import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { useDepartments, useTeams } from '@/features/organization/hooks';
import { userFormSchema, type UserFormValues } from '../schema';
import type { AppRole, UserAccount } from '../types';

const ROLE_OPTIONS: { value: AppRole; label: string }[] = [
  { value: 'ADMINISTRATOR', label: 'Administrateur' },
  { value: 'TECHNICIAN', label: 'Technicien' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'USER', label: 'Utilisateur' },
];

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
  existingUser?: UserAccount;
  isSubmitting: boolean;
}

export function UserFormModal({ open, onClose, onSubmit, existingUser, isSubmitting }: UserFormModalProps) {
  const { data: departments } = useDepartments();
  const { data: teams } = useTeams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    values: existingUser
      ? {
          username: existingUser.username,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          phoneNumber: existingUser.phoneNumber,
          jobTitle: existingUser.jobTitle,
          departmentId: existingUser.departmentId,
          teamId: existingUser.teamId,
          roleCodes: existingUser.roles,
        }
      : { username: '', email: '', firstName: '', lastName: '', roleCodes: ['USER'] },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={existingUser ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {!existingUser && (
            <Input label="Nom d'utilisateur" error={errors.username?.message} {...register('username')} />
          )}
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Prénom" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Nom" error={errors.lastName?.message} {...register('lastName')} />
          <Input label="Téléphone" {...register('phoneNumber')} />
          <Input label="Fonction" {...register('jobTitle')} />
          <Select
            label="Département"
            placeholder="Aucun"
            options={(departments ?? []).map((d) => ({ value: d.id.toString(), label: d.name }))}
            {...register('departmentId')}
          />
          <Select
            label="Équipe"
            placeholder="Aucune"
            options={(teams ?? []).map((t) => ({ value: t.id.toString(), label: t.name }))}
            {...register('teamId')}
          />
        </div>

        <div>
          <span className="text-xs font-medium text-text-primary">Rôles</span>
          <Controller
            control={control}
            name="roleCodes"
            render={({ field }) => (
              <div className="mt-2 flex flex-wrap gap-3">
                {ROLE_OPTIONS.map((role) => (
                  <label key={role.value} className="flex items-center gap-1.5 text-sm text-text-primary">
                    <input
                      type="checkbox"
                      checked={field.value?.includes(role.value)}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...(field.value ?? []), role.value]
                          : (field.value ?? []).filter((r) => r !== role.value);
                        field.onChange(next);
                      }}
                    />
                    {role.label}
                  </label>
                ))}
              </div>
            )}
          />
          {errors.roleCodes && <span className="text-xs text-error">{errors.roleCodes.message}</span>}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
