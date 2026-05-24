import { useEffect, useState } from 'react';
import { Link2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { VinculoService, type Vinculo } from '@/services/vinculoService';
import { AlunoService, type Aluno } from '@/services/alunoService';
import { GrupoService, type Grupo } from '@/services/grupoService';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { useConfirm } from '@/hooks/useConfirm';
import { getApiErrorMessage } from '@/lib/apiError';

export default function Vinculos() {
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const { confirm } = useConfirm();

  async function load() {
    setLoading(true);
    try {
      const [v, a, g] = await Promise.all([
        VinculoService.list(),
        AlunoService.list(),
        GrupoService.list(),
      ]);
      setVinculos(v);
      setAlunos(a);
      setGrupos(g);
    } catch {
      toast.error('Erro ao carregar vínculos');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function vincular() {
    if (!studentId || !groupId) {
      setErro('Selecione aluno e grupo.');
      return;
    }
    setSaving(true);
    setErro('');
    try {
      await VinculoService.create(Number(studentId), Number(groupId));
      setStudentId('');
      setGroupId('');
      toast.success('Vínculo criado');
      await load();
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Erro ao vincular. O aluno pode já estar neste grupo.'));
    } finally {
      setSaving(false);
    }
  }

  function pedirRemocao(id: number) {
    confirm({
      title: 'Remover vínculo',
      message: 'O aluno deixará de receber notificações deste grupo.',
      confirmLabel: 'Remover',
      onConfirm: async () => {
        try {
          await VinculoService.remove(id);
          toast.success('Vínculo removido');
          await load();
        } catch (err) {
          toast.error(getApiErrorMessage(err, 'Erro ao remover'));
        }
      },
    });
  }

  return (
    <div>
      <PageHeader
        title="Vínculos aluno–grupo"
        description="Associe alunos aos grupos de notificação"
      />

      <Card className="mb-6">
        <h2 className="text-sm font-bold text-navy mb-4">Novo vínculo</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={studentId} onChange={e => setStudentId(e.target.value)} className="flex-1">
            <option value="">Selecione um aluno...</option>
            {alunos.map(a => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.registrationNumber}
              </option>
            ))}
          </Select>
          <Select value={groupId} onChange={e => setGroupId(e.target.value)} className="flex-1">
            <option value="">Selecione um grupo...</option>
            {grupos.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </Select>
          <Button onClick={vincular} disabled={saving} className="shrink-0">
            <Link2 className="w-4 h-4" />
            {saving ? 'Vinculando...' : 'Vincular'}
          </Button>
        </div>
        {erro && <p className="text-red-500 text-xs mt-3">{erro}</p>}
      </Card>

      <Card padding={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-sm font-bold text-navy">Vínculos existentes ({vinculos.length})</p>
        </div>
        {loading ? (
          <TableSkeleton cols={3} />
        ) : vinculos.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="Nenhum vínculo cadastrado"
            description="Vincule alunos a grupos para enviar notificações em massa"
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {['Aluno', 'Grupo', ''].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vinculos.map(v => (
                <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 font-medium text-navy">
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                        {v.studentName?.charAt(0)}
                      </div>
                      {v.studentName}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-accent">
                      {v.groupName}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => pedirRemocao(v.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

    </div>
  );
}
