import { apiClient } from './client';
import type { AuditLogEntry } from '../types';

export function getMeuHistorico(): Promise<AuditLogEntry[]> {
  return apiClient.get('/audit-log/me').then((res) => res.data);
}
