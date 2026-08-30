'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/Spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { autenticado, carregando } = useAuth();
  const router = useRouter();

  // O App Router não tem um <Navigate> declarativo como o React Router;
  // o redirecionamento precisa ser feito imperativamente em um efeito.
  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace('/login');
    }
  }, [carregando, autenticado, router]);

  if (carregando || !autenticado) {
    return <Spinner />;
  }

  return <>{children}</>;
}
