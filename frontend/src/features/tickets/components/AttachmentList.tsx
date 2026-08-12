import { useRef } from 'react';
import { Paperclip, Download, Upload } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { attachmentsApi } from '../api/attachmentsApi';
import { useAttachments, useUploadAttachment } from '../hooks';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function AttachmentList({ ticketId }: { ticketId: number }) {
  const { data } = useAttachments(ticketId);
  const upload = useUploadAttachment(ticketId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await upload.mutateAsync(file);
    }
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text-primary">Pièces jointes</span>
        <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} loading={upload.isPending}>
          <Upload className="h-3.5 w-3.5" />
          Ajouter un fichier
        </Button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
      </div>

      {data && data.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {data.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Paperclip className="h-4 w-4 shrink-0 text-text-secondary" />
                <span className="truncate text-sm text-text-primary">{attachment.fileName}</span>
                <span className="shrink-0 text-xs text-text-secondary">{formatSize(attachment.sizeBytes)}</span>
              </div>
              <a href={attachmentsApi.downloadUrl(attachment.id)} className="text-text-secondary hover:text-brand">
                <Download className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Aucune pièce jointe" />
      )}
    </div>
  );
}
