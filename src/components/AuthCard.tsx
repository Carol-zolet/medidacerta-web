import type { ReactNode } from 'react';

/** Cartão branco centralizado usado nas telas de autenticação (login, cadastro, senha). */
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-[var(--color-text-dark)]">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
