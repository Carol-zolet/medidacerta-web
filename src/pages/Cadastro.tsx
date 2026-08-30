import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { AuthCard } from '../components/AuthCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FormError } from '../components/FormError';
import { PasswordChecklist, senhaValida } from '../components/PasswordChecklist';

export function Cadastro() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);

    if (!senhaValida(senha)) {
      setErro('A senha precisa ter no mínimo 8 caracteres e ao menos 1 número.');
      return;
    }

    setEnviando(true);
    try {
      await register({ nome, sobrenome, email, senha });
      navigate('/login', { state: { cadastroConcluido: true } });
    } catch (error) {
      setErro(getErrorMessage(error, 'Não foi possível concluir o cadastro.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthCard title="Criar conta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={erro} />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="nome"
            label="Nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Input
            id="sobrenome"
            label="Sobrenome"
            required
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
          />
        </div>
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
          autoComplete="new-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <PasswordChecklist senha={senha} />
        <Button type="submit" loading={enviando}>
          Cadastrar
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-text-body)]">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-[var(--color-primary)] hover:underline">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
