import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { AuthCard } from '../components/AuthCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FormError } from '../components/FormError';
import { FormSuccess } from '../components/FormSuccess';

const MENSAGEM_GENERICA =
  'Se o e-mail informado estiver cadastrado, você receberá instruções para redefinir sua senha.';

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await forgotPassword(email);
      setEnviado(true);
    } catch (error) {
      setErro(getErrorMessage(error));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthCard title="Esqueci minha senha">
      {enviado ? (
        <FormSuccess message={MENSAGEM_GENERICA} />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormError message={erro} />
          <p className="text-sm text-[var(--color-text-body)]">
            Informe o e-mail da sua conta. Enviaremos um link para redefinir sua senha.
          </p>
          <Input
            id="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" loading={enviando}>
            Enviar
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-[var(--color-text-body)]">
        <Link to="/login" className="font-medium text-[var(--color-primary)] hover:underline">
          Voltar para o login
        </Link>
      </p>
    </AuthCard>
  );
}
