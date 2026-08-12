import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { Loader } from '@/shared/ui/Loader';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useToast } from '@/shared/ui/Toast';
import { cn } from '@/shared/lib/cn';
import { useDeleteTicket, useTicket, useTicketHistory } from '../hooks';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CommentThread } from '../components/CommentThread';
import { AttachmentList } from '../components/AttachmentList';
import { HistoryTimeline } from '../components/HistoryTimeline';

type TabKey = 'comments' | 'attachments' | 'history';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'comments', label: 'Commentaires' },
  { key: 'attachments', label: 'Pièces jointes' },
  { key: 'history', label: 'Historique' },
];

export function TicketDetailPage() {
  const { id } = useParams();
  const ticketId = Number(id);
  const navigate = useNavigate();
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('comments');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: ticket, isLoading } = useTicket(ticketId);
  const { data: history } = useTicketHistory(ticketId);
  const deleteTicket = useDeleteTicket();

  if (isLoading || !ticket) {
    return <Loader fullHeight />;
  }

  const handleDelete = async () => {
    await deleteTicket.mutateAsync(ticketId);
    push({ tone: 'success', title: 'Ticket supprimé' });
    navigate('/tickets');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="font-mono">{ticket.reference}</span>
            <span>·</span>
            <span>Créé le {format(new Date(ticket.createdAt), 'dd/MM/yyyy')}</span>
          </div>
          <h1 className="mt-1 text-lg font-semibold text-text-primary">{ticket.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/tickets/${ticketId}/edit`)}>
            <Pencil className="h-3.5 w-3.5" />
            Modifier
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-3.5 w-3.5" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 flex flex-col gap-5">
          <Card>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-text-primary">{ticket.description}</p>
              {ticket.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ticket.tags.map((tag) => (
                    <Badge key={tag.id} colorHex={tag.colorHex}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <div className="flex border-b border-border px-5">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'border-b-2 border-transparent px-4 py-3 text-sm font-medium text-text-secondary transition-colors',
                    activeTab === tab.key && 'border-brand text-brand',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <CardContent>
              {activeTab === 'comments' && <CommentThread ticketId={ticketId} />}
              {activeTab === 'attachments' && <AttachmentList ticketId={ticketId} />}
              {activeTab === 'history' && <HistoryTimeline entries={history?.content ?? []} />}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-medium text-text-secondary">Statut</span>
                <div className="mt-1">
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-text-secondary">Priorité</span>
                <div className="mt-1">
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-text-secondary">Demandeur</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <Avatar name={ticket.requester.fullName} size="sm" />
                  <span className="text-sm text-text-primary">{ticket.requester.fullName}</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-text-secondary">Assigné à</span>
                <div className="mt-1.5 flex items-center gap-2">
                  {ticket.assignee ? (
                    <>
                      <Avatar name={ticket.assignee.fullName} size="sm" />
                      <span className="text-sm text-text-primary">{ticket.assignee.fullName}</span>
                    </>
                  ) : (
                    <span className="text-sm text-text-secondary">Non assigné</span>
                  )}
                </div>
              </div>
              {ticket.category && (
                <div>
                  <span className="text-xs font-medium text-text-secondary">Catégorie</span>
                  <p className="mt-1 text-sm text-text-primary">{ticket.category.name}</p>
                </div>
              )}
              {ticket.dueDate && (
                <div>
                  <span className="text-xs font-medium text-text-secondary">Date limite</span>
                  <p className="mt-1 text-sm text-text-primary">{format(new Date(ticket.dueDate), 'dd/MM/yyyy')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Supprimer ce ticket ?"
        description="Cette action est irréversible et supprimera également les commentaires et pièces jointes associés."
        confirmLabel="Supprimer"
        destructive
        loading={deleteTicket.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
