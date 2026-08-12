import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { Loader } from '@/shared/ui/Loader';
import { useToast } from '@/shared/ui/Toast';
import { useProfile, useUpdateProfile } from '../hooks';
import type { ProfileUpdatePayload } from '../api/profileApi';

export function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { push } = useToast();

  const { register, handleSubmit } = useForm<ProfileUpdatePayload>({
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phoneNumber: profile.phoneNumber,
          jobTitle: profile.jobTitle,
          avatarUrl: profile.avatarUrl,
          locale: profile.locale,
        }
      : undefined,
  });

  if (isLoading || !profile) {
    return <Loader fullHeight />;
  }

  const onSubmit = async (values: ProfileUpdatePayload) => {
    await updateProfile.mutateAsync(values);
    push({ tone: 'success', title: 'Profil mis à jour' });
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar name={`${profile.firstName} ${profile.lastName}`} imageUrl={profile.avatarUrl} size="lg" />
        <div>
          <h1 className="text-lg font-semibold text-text-primary">{profile.firstName} {profile.lastName}</h1>
          <p className="text-sm text-text-secondary">{profile.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Prénom" {...register('firstName')} />
              <Input label="Nom" {...register('lastName')} />
              <Input label="Téléphone" {...register('phoneNumber')} />
              <Input label="Fonction" {...register('jobTitle')} />
              <Input label="URL de l'avatar" {...register('avatarUrl')} />
              <Select
                label="Langue"
                options={[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'English' },
                ]}
                {...register('locale')}
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={updateProfile.isPending}>
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
