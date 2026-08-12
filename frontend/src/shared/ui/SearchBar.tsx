import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Rechercher…', className }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-md border border-border bg-background-secondary pl-9 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus-ring"
      />
    </div>
  );
}
