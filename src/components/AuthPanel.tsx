type Props = {
  headline: React.ReactNode;
  subtext: string;
};

export function AuthPanel({ headline, subtext }: Props) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-navy"
    >
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent-light/5" />

      <div className="relative z-10">
        <span className="text-white font-bold text-2xl tracking-tight">
          Campus <span className="text-accent-light">Notify</span>
        </span>
      </div>

      <div className="relative z-10">
        <h2 className="text-white text-4xl font-bold leading-tight mb-4">{headline}</h2>
        <p className="text-slate-400 text-base leading-relaxed">{subtext}</p>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white text-sm font-bold">
          CN
        </div>
        <div>
          <p className="text-white text-sm font-medium">Gestão acadêmica inteligente</p>
          <p className="text-slate-500 text-xs">Notificações automáticas via WhatsApp</p>
        </div>
      </div>
    </div>
  );
}
