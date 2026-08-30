'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getMe } from '../api/users';
import { setUnauthorizedHandler } from '../api/client';
import { clearToken, getToken, setToken as persistToken } from '../api/token';
import type { Usuario } from '../types';

interface AuthContextValue {
  usuario: Usuario | null;
  /** true enquanto a sessão inicial (token salvo -> validação via /users/me) está sendo checada. */
  carregando: boolean;
  autenticado: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  /** Re-busca /users/me (usado após editar medidas, por exemplo, para atualizar o código de acesso). */
  recarregarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setUsuario(null);
  }, []);

  const recarregarUsuario = useCallback(async () => {
    const dados = await getMe();
    setUsuario(dados);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUsuario(null);
    });
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCarregando(false);
      return;
    }

    getMe()
      .then((dados) => setUsuario(dados))
      .catch(() => {
        clearToken();
        setUsuario(null);
      })
      .finally(() => setCarregando(false));
  }, []);

  const login = useCallback(async (token: string) => {
    persistToken(token);
    const dados = await getMe();
    setUsuario(dados);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      usuario,
      carregando,
      autenticado: !!usuario,
      login,
      logout,
      recarregarUsuario,
    }),
    [usuario, carregando, login, logout, recarregarUsuario],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
