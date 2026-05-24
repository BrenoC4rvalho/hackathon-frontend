import { cn } from '@/lib/cn';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ label, error, className, children, id, ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-navy mb-1.5">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full border rounded-xl px-4 py-2.5 text-sm text-navy bg-white',
          'outline-none transition focus:ring-2 focus:ring-accent/30 focus:border-accent',
          error ? 'border-red-300' : 'border-slate-200',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
