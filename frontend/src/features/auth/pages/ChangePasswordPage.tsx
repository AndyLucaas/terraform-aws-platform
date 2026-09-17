import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { authApi } from '../authApi';
import { tokenStorage } from '../tokenStorage';
import { useAuth } from '../AuthContext';
import { changePasswordSchema, type ChangePasswordFormValues } from '../schema';

export function ChangePasswordPage() {
  const { clearPasswordChangeRequirement } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setSubmitError(null);
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      await authApi.changePassword(
        { currentPassword: values.currentPassword, newPassword: values.newPassword },
        accessToken,
      );
      clearPasswordChangeRequirement();
      push({ tone: 'success', title: 'Mot de passe modifié' });
      navigate('/', { replace: true });
    } catch {
      setSubmitError('Le mot de passe actuel est incorrect');
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Changer votre mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-text-secondary">
            Pour des raisons de sécurité, vous devez définir un nouveau mot de passe avant de continuer.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
            <Input
              label="Mot de passe actuel"
              type="password"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <Input
              label="Nouveau mot de passe"
              type="password"
              autoComplete="new-password"
              hint="10 caractères minimum"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {submitError && (
              <div className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-xs text-error">
                {submitError}
              </div>
            )}

            <Button type="submit" loading={isSubmitting}>
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
