import { useState } from 'react';
import { Send, Lightbulb, Info } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const exemplos = [
  'Lembrete: você tem uma prova de Cálculo I amanhã às 14h. Boa sorte!',
  'Aviso: o trabalho de Estruturas de Dados deve ser entregue até sexta-feira.',
  'Evento: Workshop de React acontece hoje às 19h no Lab de Informática.',
];

export default function Whatsapp() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function enviar() {
    if (!to || !message) {
      toast.error('Preencha telefone e mensagem');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/whatsapp/send', { to, message });
      toast.success('Mensagem enviada com sucesso');
      setMessage('');
    } catch {
      toast.error('Erro ao enviar. Verifique as credenciais Twilio no backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="WhatsApp"
        description="Envie mensagens de teste via integração Twilio"
      />

      <div className="flex items-start gap-3 p-4 rounded-2xl mb-6 border border-amber-200 bg-amber-50">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          Configure as credenciais Twilio no backend (<code className="font-mono bg-amber-100/80 px-1 rounded">application.yaml</code>) para habilitar o envio real.
        </p>
      </div>

      <Card className="mb-4">
        <div className="space-y-5">
          <Input
            label="Número de destino"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="+55 11 99999-9999"
            hint="Formato internacional: +55 + DDD + número"
          />
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-navy">Mensagem</label>
              <span className="text-xs text-muted">{message.length} caracteres</span>
            </div>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Digite a mensagem de teste..."
              rows={5}
            />
          </div>
          <Button
            variant="success"
            size="lg"
            className="w-full"
            onClick={enviar}
            disabled={loading || !to || !message}
          >
            <Send className="w-4 h-4" />
            {loading ? 'Enviando...' : 'Enviar via WhatsApp'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <p className="text-sm font-bold text-navy">Mensagens de exemplo</p>
        </div>
        <div className="space-y-2">
          {exemplos.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMessage(m)}
              className="block w-full text-left px-4 py-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition text-xs text-navy leading-relaxed"
            >
              {m}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
