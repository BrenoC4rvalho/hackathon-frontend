import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Link2,
  ClipboardList,
  Bell,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/services/authService';
import { paths } from '@/routes/paths';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';

const nav = [
  { to: paths.home, label: 'Dashboard', icon: LayoutDashboard },
  { to: paths.alunos, label: 'Alunos', icon: GraduationCap },
  { to: paths.grupos, label: 'Grupos', icon: Users },
  { to: paths.vinculos, label: 'Vínculos', icon: Link2 },
  { to: paths.tarefas, label: 'Tarefas', icon: ClipboardList },
  { to: paths.notificacoes, label: 'Notificações', icon: Bell },
  { to: paths.whatsapp, label: 'WhatsApp', icon: MessageCircle },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? 'U';

  async function handleLogout() {
    await AuthService.logout();
    await refresh();
    toast.success('Sessão encerrada');
    navigate(paths.login);
  }

  const SidebarContent = () => (
    <aside className="flex flex-col h-full w-60 min-w-60 bg-navy text-white">
      <div className="px-5 py-5 border-b border-navy-mid">
        <span className="font-bold text-lg tracking-tight">
          Campus <span className="text-accent-light">Notify</span>
        </span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === paths.home}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-accent text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
              )
            }
          >
            <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-navy-mid">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-navy-mid text-slate-400 text-xs font-medium hover:bg-white/5 hover:text-white transition"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="hidden lg:block sticky top-0 h-screen shrink-0">
        <SidebarContent />
      </div>

      <div
        className={cn(
          'fixed top-0 left-0 h-full z-30 lg:hidden transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-10 flex items-center gap-3 h-14 px-4 bg-white border-b border-slate-100">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="p-2 -ml-1 rounded-lg text-navy hover:bg-slate-100"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-navy">
            Campus <span className="text-accent">Notify</span>
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
