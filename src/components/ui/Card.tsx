import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
};

export function Card({ children, className, padding = true }: Props) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-card)]',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
