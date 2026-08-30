import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    return <Spinner />;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
