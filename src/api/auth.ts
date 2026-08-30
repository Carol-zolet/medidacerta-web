import { apiClient } from './client';
import type { LoginPayload, RegisterPayload, Usuario } from '../types';

export function login(payload: LoginPayload): Promise<{ access_token: string }> {
  return apiClient.post('/auth/login', payload).then((res) => res.data);
}

export function register(payload: RegisterPayload): Promise<Usuario> {
  return apiClient.post('/auth/register', payload).then((res) => res.data);
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return apiClient.post('/auth/forgot-password', { email }).then((res) => res.data);
}

export function resetPassword(token: string, novaSenha: string): Promise<{ message: string }> {
  return apiClient.post('/auth/reset-password', { token, novaSenha }).then((res) => res.data);
}
