import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

interface TemporaryPasswordModalProps {
  open: boolean;
  username: string;
  temporaryPassword: string;
  onClose: () => void;
}

export function TemporaryPasswordModal({
  open,
  username,
  temporaryPassword,
  onClose,
}: TemporaryPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mot de passe temporaire"
      description="Transmettez-le à l'utilisateur par un canal sûr — il ne sera plus jamais affiché."
      size="sm"
    >
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-xs font-medium text-text-secondary">Utilisateur</span>
          <p className="text-sm text-text-primary">{username}</p>
        </div>

        <div>
          <span className="text-xs font-medium text-text-secondary">Mot de passe temporaire</span>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary">
              {temporaryPassword}
            </code>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <p className="text-xs text-text-secondary">
          L'utilisateur devra définir son propre mot de passe dès sa première connexion.
        </p>

        <div className="flex justify-end">
          <Button onClick={onClose}>J'ai noté le mot de passe</Button>
        </div>
      </div>
    </Modal>
  );
}
