'use client';

import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { login as loginRequest } from '@/api/auth';
import { getErrorMessage } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { AuthCard } from '@/components/AuthCard';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import { Spinner } from '@/components/Spinner';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Equivalente ao "location.state" do React Router: aqui usamos query
  // string, já que o App Router não tem estado de navegação declarativo.
  const mensagemSucesso = searchParams.get('cadastro')
    ? 'Cadastro concluído! Faça login para continuar.'
    : searchParams.get('senha') === 'redefinida'
      ? 'Senha redefinida com sucesso! Faça login com sua nova senha.'
      : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const { access_token } = await loginRequest({ email, senha });
      await login(access_token);
      router.push('/painel');
    } catch (error) {
      setErro(getErrorMessage(error, 'Não foi possível entrar. Verifique seu e-mail e senha.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthCard title="Entrar">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={erro} />
        <FormSuccess message={erro ? null : mensagemSucesso} />
        <Input
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="senha"
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Link href="/esqueci-senha" className="text-right text-sm text-[var(--color-primary)] hover:underline">
          Esqueci minha senha
        </Link>
        <Button type="submit" loading={enviando}>
          Entrar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-text-body)]">
        Ainda não tem conta?{' '}
        <Link href="/cadastro" className="font-medium text-[var(--color-primary)] hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginForm />
    </Suspense>
  );
}
