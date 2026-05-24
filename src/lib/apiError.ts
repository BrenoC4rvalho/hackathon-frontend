import axios from 'axios';

type ApiErrorBody = {
  message?: string;
  error?: string;
};

export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro. Tente novamente.'): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data as ApiErrorBody | string | undefined;

  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data === 'object') {
    if (data.message?.trim()) return data.message;
    if (data.error?.trim()) return data.error;
  }

  if (error.response?.status === 401) return 'Sessão expirada. Faça login novamente.';
  if (error.response?.status === 403) return 'Você não tem permissão para esta ação.';
  if (error.response?.status === 404) return 'Recurso não encontrado.';
  if (error.response?.status && error.response.status >= 500) {
    return 'Erro no servidor. Tente novamente mais tarde.';
  }

  return fallback;
}
