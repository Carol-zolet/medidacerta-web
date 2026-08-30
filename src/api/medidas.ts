import { apiClient } from './client';
import type { Medidas, UpsertMedidasPayload } from '../types';

export function upsertMedidas(payload: UpsertMedidasPayload): Promise<Medidas> {
  return apiClient.post('/medidas', payload).then((res) => res.data);
}

/** Retorna null quando o usuário ainda não cadastrou medidas (404 é esperado, não é erro). */
export async function getMinhasMedidas(): Promise<Medidas | null> {
  try {
    const res = await apiClient.get<Medidas>('/medidas/me');
    return res.data;
  } catch (error) {
    const status = (error as { response?: { status?: number } }).response?.status;
    if (status === 404) {
      return null;
    }
    throw error;
  }
}
