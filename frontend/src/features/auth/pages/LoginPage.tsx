import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '../AuthContext';
import { loginSchema, type LoginFormValues } from '../schema';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    try {
      await login(values);
      navigate('/', { replace: true });
    } catch {
      // Message volontairement générique : ne jamais révéler si c'est le nom
      // d'utilisateur ou le mot de passe qui est incorrect (énumération de comptes).
      setSubmitError('Nom d\u2019utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-sm font-bold text-white">
            IT
          </div>
          <span className="text-base font-semibold text-text-primary">IT Desk</span>
        </div>

        <Card>
          <CardContent>
            <h1 className="text-sm font-semibold text-text-primary">Connexion</h1>
            <p className="mt-0.5 text-xs text-text-secondary">
              Accédez à la plateforme de gestion de tickets
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
              <Input
                label="Nom d'utilisateur"
                autoComplete="username"
                autoFocus
                error={errors.username?.message}
                {...register('username')}
              />
              <Input
                label="Mot de passe"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />

              {submitError && (
                <div className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-xs text-error">
                  {submitError}
                </div>
              )}

              <Button type="submit" loading={isSubmitting} className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
