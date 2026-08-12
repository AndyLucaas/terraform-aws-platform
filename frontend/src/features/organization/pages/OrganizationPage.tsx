import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useToast } from '@/shared/ui/Toast';
import {
  useCreateDepartment,
  useCreateTeam,
  useDeleteDepartment,
  useDeleteTeam,
  useDepartments,
  useTeams,
} from '../hooks';

export function OrganizationPage() {
  const { push } = useToast();
  const { data: departments } = useDepartments();
  const { data: teams } = useTeams();
  const createDepartment = useCreateDepartment();
  const createTeam = useCreateTeam();
  const deleteDepartment = useDeleteDepartment();
  const deleteTeam = useDeleteTeam();

  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamDepartmentId, setTeamDepartmentId] = useState('');

  const handleCreateDepartment = async () => {
    await createDepartment.mutateAsync({ name: departmentName });
    push({ tone: 'success', title: 'Département créé' });
    setDepartmentName('');
    setDepartmentModalOpen(false);
  };

  const handleCreateTeam = async () => {
    await createTeam.mutateAsync({ name: teamName, departmentId: Number(teamDepartmentId) });
    push({ tone: 'success', title: 'Équipe créée' });
    setTeamName('');
    setTeamModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Organisation</h1>
        <p className="text-sm text-text-secondary">Départements et équipes de l'entreprise</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Départements</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setDepartmentModalOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-3">
            {departments && departments.length > 0 ? (
              departments.map((department) => (
                <div key={department.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{department.name}</p>
                    <Badge tone="neutral">{department.teamCount} équipe(s)</Badge>
                  </div>
                  <button
                    onClick={() => deleteDepartment.mutate(department.id)}
                    className="text-text-secondary hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <EmptyState title="Aucun département" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Équipes</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setTeamModalOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-3">
            {teams && teams.length > 0 ? (
              teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{team.name}</p>
                    <p className="text-xs text-text-secondary">{team.departmentName}</p>
                  </div>
                  <button onClick={() => deleteTeam.mutate(team.id)} className="text-text-secondary hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <EmptyState title="Aucune équipe" />
            )}
          </CardContent>
        </Card>
      </div>

      <Modal open={departmentModalOpen} onClose={() => setDepartmentModalOpen(false)} title="Nouveau département" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Nom" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDepartmentModalOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateDepartment} loading={createDepartment.isPending}>Créer</Button>
          </div>
        </div>
      </Modal>

      <Modal open={teamModalOpen} onClose={() => setTeamModalOpen(false)} title="Nouvelle équipe" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Nom" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          <Select
            label="Département"
            placeholder="Sélectionner"
            value={teamDepartmentId}
            onChange={(e) => setTeamDepartmentId(e.target.value)}
            options={(departments ?? []).map((d) => ({ value: d.id.toString(), label: d.name }))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTeamModalOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateTeam} loading={createTeam.isPending}>Créer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
