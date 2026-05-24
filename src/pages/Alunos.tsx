import { useEffect, useState } from 'react';
import { GraduationCap, Pencil, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AlunoService, type Aluno } from '@/services/alunoService';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { useConfirm } from '@/hooks/useConfirm';
import { formatDate } from '@/lib/format';
import { getApiErrorMessage } from '@/lib/apiError';

const empty = { name: '', registrationNumber: '', phoneNumber: '', birthDate: '' };

export default function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'criar' | 'editar' | null>(null);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [search, setSearch] = useState('');
  const { confirm } = useConfirm();

  async function load() {
    setLoading(true);
    try {
      setAlunos(await AlunoService.list());
    } catch {
      toast.error('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  function openCriar() {
    setForm(empty);
    setErro('');
    setModal('criar');
  }
  function openEditar(a: Aluno) {
    setForm({
      name: a.name,
      registrationNumber: a.registrationNumber,
      phoneNumber: a.phoneNumber,
      birthDate: a.birthDate,
    });
    setEditId(a.id);
    setErro('');
    setModal('editar');
  }
  function fechar() {
    setModal(null);
    setEditId(null);
  }

  async function salvar() {
    if (!form.name || !form.registrationNumber) {
      setErro('Nome e matrícula são obrigatórios.');
      return;
    }
    setSaving(true);
    setErro('');
    try {
      if (modal === 'criar') await AlunoService.create(form);
      else if (modal === 'editar' && editId) await AlunoService.update(editId, form);
      toast.success(modal === 'criar' ? 'Aluno cadastrado' : 'Aluno atualizado');
      await load();
      fechar();
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Erro ao salvar. Verifique os dados.'));
    } finally {
      setSaving(false);
    }
  }

  function pedirExclusao(id: number) {
    confirm({
      title: 'Excluir aluno',
      message: 'Esta ação não pode ser desfeita.',
      confirmLabel: 'Excluir',
      onConfirm: async () => {
        try {
          await AlunoService.remove(id);
          toast.success('Aluno excluído');
          await load();
        } catch (err) {
          toast.error(getApiErrorMessage(err, 'Erro ao excluir'));
        }
      },
    });
  }

  const filtered = alunos.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.registrationNumber.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Alunos"
        description={`${alunos.length} aluno(s) cadastrado(s)`}
        action={{ label: 'Novo Aluno', onClick: openCriar, icon: UserPlus }}
      />

      <Card padding={false} className="overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome ou matrícula..." />
        </div>

        {loading ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Nenhum aluno encontrado"
            description="Cadastre o primeiro aluno para começar"
            action={{ label: 'Novo Aluno', onClick: openCriar }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {['Nome', 'Matrícula', 'Telefone', 'Nascimento', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 font-medium text-navy">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        {a.name}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{a.registrationNumber}</td>
                    <td className="px-5 py-3.5 text-muted">{a.phoneNumber}</td>
                    <td className="px-5 py-3.5 text-muted">{formatDate(a.birthDate)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2 justify-end">
                        <Button variant="secondary" size="sm" onClick={() => openEditar(a)}>
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => pedirExclusao(a.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={!!modal}
        onClose={fechar}
        title={modal === 'criar' ? 'Novo Aluno' : 'Editar Aluno'}
        footer={
          <>
            <Button variant="secondary" className="flex-1" onClick={fechar}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={salvar} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: João Silva" required />
          <Input label="Matrícula" value={form.registrationNumber} onChange={e => setForm({ ...form, registrationNumber: e.target.value })} placeholder="Ex: 2024001" required />
          <Input label="Telefone (WhatsApp)" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+55 11 99999-9999" required />
          <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} required />
          {erro && <p className="text-red-500 text-xs">{erro}</p>}
        </div>
      </Modal>

    </div>
  );
}
