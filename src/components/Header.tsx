'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';

export function Header() {
  const { usuario, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-accent-gold)]/25 bg-white px-6 py-4">
      <span className="font-title text-lg font-bold text-[var(--color-text-title)]">MedidaCerta</span>
      <div className="flex items-center gap-4">
        {usuario && <span className="text-sm text-[var(--color-text-body)]">{usuario.nome}</span>}
        <Button variant="secondary" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
