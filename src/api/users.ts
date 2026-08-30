import { apiClient } from './client';
import type { Usuario } from '../types';

export function getMe(): Promise<Usuario> {
  return apiClient.get('/users/me').then((res) => res.data);
}

export function deleteMe(): Promise<{ message: string }> {
  return apiClient.delete('/users/me').then((res) => res.data);
}
