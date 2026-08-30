'use client';

import { useEffect, useState } from 'react';
import { getMeuHistorico } from '@/api/auditLog';
import { getErrorMessage } from '@/api/client';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { Header } from '@/components/Header';
import { BackButton } from '@/components/BackButton';
import { FormError } from '@/components/FormError';
import { Spinner } from '@/components/Spinner';
import type { AuditLogEntry } from '@/types';

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function HistoricoConteudo() {
  const [historico, setHistorico] = useState<AuditLogEntry[] | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    getMeuHistorico()
      .then(setHistorico)
      .catch((error) => setErro(getErrorMessage(error, 'Não foi possível carregar o histórico.')))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-xl border border-[var(--color-accent-gold)]/25 bg-white p-8 shadow-md">
          <BackButton fallbackHref="/painel" />
          <h1 className="font-title mb-1 text-2xl font-bold text-[var(--color-text-title)]">
            Histórico de atividades
          </h1>
          <p className="mb-6 text-sm text-[var(--color-text-body)]">
            Últimos eventos relacionados à sua conta: alterações nas medidas e consultas públicas
            ao seu código de acesso.
          </p>

          <FormError message={erro} />

          {carregando ? (
            <Spinner />
          ) : historico && historico.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {historico.map((item, indice) => (
                <li key={indice} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-body)]">{item.resumo}</p>
                    {item.ip && <p className="mt-0.5 text-xs text-slate-400">IP: {item.ip}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">{formatarData(item.criadoEm)}</span>
                </li>
              ))}
            </ul>
          ) : (
            !erro && (
              <p className="text-sm text-[var(--color-text-body)]">Nenhuma atividade ainda.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function HistoricoPage() {
  return (
    <ProtectedRoute>
      <HistoricoConteudo />
    </ProtectedRoute>
  );
}
