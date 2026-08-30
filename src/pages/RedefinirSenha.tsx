import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { AuthCard } from '../components/AuthCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FormError } from '../components/FormError';
import { PasswordChecklist, senhaValida } from '../components/PasswordChecklist';

export function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [novaSenha, setNovaSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);

    if (!senhaValida(novaSenha)) {
      setErro('A senha precisa ter no mínimo 8 caracteres e ao menos 1 número.');
      return;
    }

    setEnviando(true);
    try {
      await resetPassword(token, novaSenha);
      navigate('/login', { state: { senhaRedefinida: true } });
    } catch (error) {
      setErro(getErrorMessage(error, 'Token inválido ou expirado. Solicite um novo link.'));
    } finally {
      setEnviando(false);
    }
  }

  if (!token) {
    return (
      <AuthCard title="Redefinir senha">
        <FormError message="Link inválido: token não encontrado. Solicite um novo link em 'Esqueci minha senha'." />
        <p className="mt-6 text-center text-sm text-[var(--color-text-body)]">
          <Link to="/esqueci-senha" className="font-medium text-[var(--color-primary)] hover:underline">
            Solicitar novo link
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Redefinir senha">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormError message={erro} />
        <Input
          id="novaSenha"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          required
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <PasswordChecklist senha={novaSenha} />
        <Button type="submit" loading={enviando}>
          Redefinir senha
        </Button>
      </form>
    </AuthCard>
  );
}
