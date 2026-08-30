import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { AuthCard } from '../components/AuthCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FormError } from '../components/FormError';
import { FormSuccess } from '../components/FormSuccess';

interface LocationState {
  cadastroConcluido?: boolean;
  senhaRedefinida?: boolean;
}

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const mensagemSucesso = state?.cadastroConcluido
    ? 'Cadastro concluído! Faça login para continuar.'
    : state?.senhaRedefinida
      ? 'Senha redefinida com sucesso! Faça login com sua nova senha.'
      : null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const { access_token } = await loginRequest({ email, senha });
      await login(access_token);
      navigate('/painel');
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
        <Link to="/esqueci-senha" className="text-right text-sm text-[var(--color-primary)] hover:underline">
          Esqueci minha senha
        </Link>
        <Button type="submit" loading={enviando}>
          Entrar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-text-body)]">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-medium text-[var(--color-primary)] hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthCard>
  );
}
