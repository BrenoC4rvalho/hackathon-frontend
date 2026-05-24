import { Button } from './Button';
import type { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: LucideIcon; disabled?: boolean };
};

export function PageHeader({ title, description, action }: Props) {
  const Icon = action?.icon;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted mt-0.5">{description}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick} disabled={action.disabled} className="shrink-0 self-start sm:self-auto">
          {Icon && <Icon className="w-4 h-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
