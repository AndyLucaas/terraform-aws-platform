import { useState } from 'react';
import { Plus, Lock, Unlock, KeyRound, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { SearchBar } from '@/shared/ui/SearchBar';
import { Pagination } from '@/shared/ui/Pagination';
import { DataTable, type DataTableColumn } from '@/shared/ui/DataTable';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useToast } from '@/shared/ui/Toast';
import {
  useBlockUser,
  useCreateUser,
  useDeleteUser,
  useResetUserPassword,
  useUnblockUser,
  useUpdateUser,
  useUsers,
} from '../hooks';
import { UserFormModal } from '../components/UserFormModal';
import type { UserAccount } from '../types';

const STATUS_TONE = {
  ACTIVE: 'success',
  BLOCKED: 'error',
  PENDING: 'warning',
} as const;

const STATUS_LABEL = {
  ACTIVE: 'Actif',
  BLOCKED: 'Bloqué',
  PENDING: 'En attente',
};

export function UsersPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | undefined>(undefined);
  const [userToDelete, setUserToDelete] = useState<UserAccount | undefined>(undefined);

  const { push } = useToast();
  const { data, isLoading } = useUsers(query, page);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser(editingUser?.id ?? 0);
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const resetPassword = useResetUserPassword();
  const deleteUser = useDeleteUser();

  const columns: DataTableColumn<UserAccount>[] = [
    {
      key: 'name',
      header: 'Utilisateur',
      render: (user) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={`${user.firstName} ${user.lastName}`} imageUrl={user.avatarUrl} size="sm" />
          <div>
            <p className="font-medium text-text-primary">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-text-secondary">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Rôles',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <Badge key={role} tone="brand">{role}</Badge>
          ))}
        </div>
      ),
    },
    { key: 'department', header: 'Département', render: (user) => user.departmentName ?? '—' },
    { key: 'status', header: 'Statut', render: (user) => <Badge tone={STATUS_TONE[user.status]}>{STATUS_LABEL[user.status]}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (user) => (
        <div className="flex justify-end gap-1">
          <button
            title="Modifier"
            onClick={() => { setEditingUser(user); setModalOpen(true); }}
            className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-brand"
          >
            <Pencil className="h-4 w-4" />
          </button>
          {user.status === 'BLOCKED' ? (
            <button
              title="Débloquer"
              onClick={() => unblockUser.mutate(user.id)}
              className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-success"
            >
              <Unlock className="h-4 w-4" />
            </button>
          ) : (
            <button
              title="Bloquer"
              onClick={() => blockUser.mutate(user.id)}
              className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-warning"
            >
              <Lock className="h-4 w-4" />
            </button>
          )}
          <button
            title="Réinitialiser le mot de passe"
            onClick={() => {
              resetPassword.mutate(user.id);
              push({ tone: 'success', title: 'Email de réinitialisation envoyé' });
            }}
            className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-info"
          >
            <KeyRound className="h-4 w-4" />
          </button>
          <button
            title="Supprimer"
            onClick={() => setUserToDelete(user)}
            className="rounded p-1.5 text-text-secondary hover:bg-surface hover:text-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = async (values: import('../schema').UserFormValues) => {
    try {
      if (editingUser) {
        await updateUser.mutateAsync(values);
        push({ tone: 'success', title: 'Utilisateur mis à jour' });
      } else {
        await createUser.mutateAsync(values);
        push({ tone: 'success', title: 'Utilisateur créé' });
      }
      setModalOpen(false);
      setEditingUser(undefined);
    } catch {
      push({ tone: 'error', title: 'Une erreur est survenue' });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Utilisateurs</h1>
          <p className="text-sm text-text-secondary">Gérez les comptes, rôles et accès de la plateforme</p>
        </div>
        <Button onClick={() => { setEditingUser(undefined); setModalOpen(true); }}>
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      <Card>
        <div className="border-b border-border px-5 py-4">
          <SearchBar value={query} onChange={(value) => { setQuery(value); setPage(0); }} className="w-80" />
        </div>

        <DataTable columns={columns} data={data?.content ?? []} isLoading={isLoading} getRowKey={(u) => u.id} />

        {data && (
          <Pagination page={data.page} totalPages={data.totalPages} totalElements={data.totalElements} onPageChange={setPage} />
        )}
      </Card>

      <UserFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingUser(undefined); }}
        onSubmit={handleSubmit}
        existingUser={editingUser}
        isSubmitting={createUser.isPending || updateUser.isPending}
      />

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Supprimer cet utilisateur ?"
        description={`${userToDelete?.firstName} ${userToDelete?.lastName} perdra définitivement l'accès à la plateforme.`}
        confirmLabel="Supprimer"
        destructive
        loading={deleteUser.isPending}
        onConfirm={async () => {
          if (userToDelete) {
            await deleteUser.mutateAsync(userToDelete.id);
            push({ tone: 'success', title: 'Utilisateur supprimé' });
            setUserToDelete(undefined);
          }
        }}
        onCancel={() => setUserToDelete(undefined)}
      />
    </div>
  );
}
