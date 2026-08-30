'use client';

import type { ReactNode } from 'react';
import { BackButton } from './BackButton';

interface AuthCardProps {
  title: string;
  children: ReactNode;
  /** Quando definido, mostra um botão "Voltar" no topo do card. */
  backHref?: string;
}

/** Cartão branco centralizado usado nas telas de autenticação (login, cadastro, senha). */
export function AuthCard({ title, children, backHref }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-[var(--color-accent-gold)]/25 bg-white p-8 shadow-md">
        {backHref && <BackButton fallbackHref={backHref} />}
        <h1 className="font-title mb-6 text-center text-2xl font-bold text-[var(--color-text-title)]">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
