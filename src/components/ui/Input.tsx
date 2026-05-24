import { cn } from '@/lib/cn';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className, id, ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-navy mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full border rounded-xl px-4 py-2.5 text-sm text-navy',
          'outline-none transition',
          'placeholder:text-slate-400',
          'focus:ring-2 focus:ring-accent/30 focus:border-accent',
          error ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      {hint && !error && <p className="text-muted text-xs mt-1.5">{hint}</p>}
    </div>
  );
}
