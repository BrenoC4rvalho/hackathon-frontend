import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-navy mb-1">{title}</p>
      {description && <p className="text-xs text-muted max-w-xs">{description}</p>}
      {action && (
        <Button onClick={action.onClick} size="sm" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
