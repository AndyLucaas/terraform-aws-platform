import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { useCategories, useCreateTicket, useTicket, useTicketPriorities, useTicketStatuses, useUpdateTicket } from '../hooks';
import { ticketFormSchema, type TicketFormValues } from '../schema';

/**
 * Le champ HTML <input type="date"> ne produit qu'une date calendaire
 * ("2026-08-10"), alors que le backend attend un Instant ISO-8601 complet.
 * On ancre la date limite à minuit UTC de ce jour-là.
 */
function toDueDateInstant(dateOnly: string | undefined): string | undefined {
  if (!dateOnly) {
    return undefined;
  }
  return `${dateOnly}T00:00:00Z`;
}

export function TicketFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const ticketId = Number(id);
  const navigate = useNavigate();
  const { push } = useToast();

  const { data: existingTicket } = useTicket(ticketId);
  const { data: priorities } = useTicketPriorities();
  const { data: statuses } = useTicketStatuses();
  const { data: categories } = useCategories();
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket(ticketId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    values: existingTicket
      ? {
          title: existingTicket.title,
          description: existingTicket.description,
          priorityId: existingTicket.priority.id,
          statusId: existingTicket.status.id,
          categoryId: existingTicket.category?.id,
          dueDate: existingTicket.dueDate?.slice(0, 10),
        }
      : undefined,
  });

  const onSubmit = async (values: TicketFormValues) => {
    try {
      if (isEditing && values.statusId) {
        await updateTicket.mutateAsync({
          title: values.title,
          description: values.description,
          priorityId: values.priorityId,
          statusId: values.statusId,
          categoryId: values.categoryId,
          dueDate: toDueDateInstant(values.dueDate),
        });
        push({ tone: 'success', title: 'Ticket mis à jour' });
        navigate(`/tickets/${ticketId}`);
      } else {
        const created = await createTicket.mutateAsync({
          title: values.title,
          description: values.description,
          priorityId: values.priorityId,
          categoryId: values.categoryId,
          dueDate: toDueDateInstant(values.dueDate),
        });
        push({ tone: 'success', title: 'Ticket créé', description: created.reference });
        navigate(`/tickets/${created.id}`);
      }
    } catch {
      push({ tone: 'error', title: 'Une erreur est survenue', description: 'Veuillez réessayer.' });
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">
          {isEditing ? 'Modifier le ticket' : 'Nouveau ticket'}
        </h1>
        <p className="text-sm text-text-secondary">Décrivez le problème aussi précisément que possible.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Titre" placeholder="Ex : Imprimante hors service" error={errors.title?.message} {...register('title')} />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-primary">Description</label>
              <textarea
                rows={5}
                className="w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary focus-ring"
                placeholder="Décrivez le problème, les étapes de reproduction, l'impact…"
                {...register('description')}
              />
              {errors.description && <span className="text-xs text-error">{errors.description.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priorité"
                placeholder="Sélectionner"
                error={errors.priorityId?.message}
                options={(priorities ?? []).map((priority) => ({ value: priority.id.toString(), label: priority.label }))}
                {...register('priorityId')}
              />

              {isEditing && (
                <Select
                  label="Statut"
                  placeholder="Sélectionner"
                  options={(statuses ?? []).map((status) => ({ value: status.id.toString(), label: status.label }))}
                  {...register('statusId')}
                />
              )}

              <Select
                label="Catégorie"
                placeholder="Aucune"
                options={(categories ?? []).map((category) => ({ value: category.id.toString(), label: category.name }))}
                {...register('categoryId')}
              />

              <Input label="Date limite" type="date" {...register('dueDate')} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Annuler
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {isEditing ? 'Enregistrer' : 'Créer le ticket'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
