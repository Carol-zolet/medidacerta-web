import axios, { AxiosError } from 'axios';
import type { ApiErrorBody } from '../types';
import { clearToken, getToken } from './token';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Callback registrado pelo AuthContext para reagir a uma sessão expirada/inválida
 * (limpar estado do usuário e redirecionar para /login) sem criar import circular
 * entre o cliente HTTP e o contexto de autenticação.
 */
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth');
    if (error.response?.status === 401 && !isAuthRoute) {
      clearToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

/**
 * Extrai uma mensagem amigável de um erro do axios, tratando o formato
 * padronizado do backend ({ message: string | string[] }) e falhas de rede.
 */
export function getErrorMessage(error: unknown, fallback = 'Não foi possível completar a ação. Tente novamente.'): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorBody>;

    if (!err.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    }

    const message = err.response.data?.message;
    if (Array.isArray(message) && message.length > 0) {
      return message.join(' ');
    }
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return fallback;
}
