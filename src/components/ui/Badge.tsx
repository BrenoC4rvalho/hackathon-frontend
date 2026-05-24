import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  className?: string;
};

export function Badge({ children, color, bg, className }: Props) {
  return (
    <span
      className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold', className)}
      style={color && bg ? { color, background: bg } : undefined}
    >
      {children}
    </span>
  );
}
