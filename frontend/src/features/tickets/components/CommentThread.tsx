import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Send } from 'lucide-react';
import { Avatar } from '@/shared/ui/Avatar';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useAddComment, useComments } from '../hooks';

export function CommentThread({ ticketId }: { ticketId: number }) {
  const { data } = useComments(ticketId);
  const addComment = useAddComment(ticketId);
  const [content, setContent] = useState('');
  const [internal, setInternal] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await addComment.mutateAsync({ content, internal });
    setContent('');
  };

  return (
    <div className="flex flex-col gap-4">
      {data && data.content.length > 0 ? (
        <div className="flex flex-col gap-4">
          {data.content.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.author.fullName} size="sm" />
              <div className="flex-1 rounded-lg border border-border bg-surface/50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-primary">{comment.author.fullName}</span>
                  {comment.internal && <Badge tone="warning">Note interne</Badge>}
                  <span className="text-xs text-text-secondary">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-text-primary">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Aucun commentaire" description="Soyez le premier à répondre à ce ticket." />
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <textarea
          rows={3}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Ajouter un commentaire…"
          className="w-full rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-text-primary focus-ring"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input type="checkbox" checked={internal} onChange={(event) => setInternal(event.target.checked)} />
            Note interne (visible par les techniciens uniquement)
          </label>
          <Button size="sm" onClick={handleSubmit} loading={addComment.isPending}>
            <Send className="h-3.5 w-3.5" />
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}
