import { api } from './api';

export type StatusNotificacao = 'PENDING' | 'SENT' | 'ERROR';
export type Notificacao = {
  id: number; studentName: string; phone: string;
  message: string; status: StatusNotificacao; taskTitle?: string; createdAt?: string;
};

export const NotificacaoService = {
  list:    ()            => api.get<Notificacao[]>('/api/notifications').then(r => r.data),
  send:    (id: number)  => api.post(`/api/notifications/${id}/send`),
  resendErrors: ()       => api.post('/api/notifications/resend-errors'),
};
