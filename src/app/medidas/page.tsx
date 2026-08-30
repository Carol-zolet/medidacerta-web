'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getMinhasMedidas, upsertMedidas } from '@/api/medidas';
import { getErrorMessage } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { Header } from '@/components/Header';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { FormError } from '@/components/FormError';
import { Spinner } from '@/components/Spinner';

interface FormState {
  busto: string;
  torax: string;
  cintura: string;
  quadril: string;
  coxa: string;
  numero_calcado: string;
}

const CAMPOS: { chave: keyof FormState; label: string; step: string }[] = [
  { chave: 'busto', label: 'Busto (cm)', step: '0.01' },
  { chave: 'torax', label: 'Tórax (cm)', step: '0.01' },
  { chave: 'cintura', label: 'Cintura (cm)', step: '0.01' },
  { chave: 'quadril', label: 'Quadril (cm)', step: '0.01' },
  { chave: 'coxa', label: 'Coxa (cm)', step: '0.01' },
  { chave: 'numero_calcado', label: 'Número do calçado', step: '0.5' },
];

const FORM_VAZIO: FormState = {
  busto: '',
  torax: '',
  cintura: '',
  quadril: '',
  coxa: '',
  numero_calcado: '',
};

function MedidasForm() {
  const [form, setForm] = useState<FormState>(FORM_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { recarregarUsuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getMinhasMedidas()
      .then((medidas) => {
        if (medidas) {
          setForm({
            busto: medidas.busto,
            torax: medidas.torax,
            cintura: medidas.cintura,
            quadril: medidas.quadril,
            coxa: medidas.coxa,
            numero_calcado: medidas.numeroCalcado,
          });
        }
      })
      .catch((error) => setErro(getErrorMessage(error)))
      .finally(() => setCarregando(false));
  }, []);

  function handleChange(chave: keyof FormState, valor: string) {
    setForm((atual) => ({ ...atual, [chave]: valor }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await upsertMedidas({
        busto: Number(form.busto),
        torax: Number(form.torax),
        cintura: Number(form.cintura),
        quadril: Number(form.quadril),
        coxa: Number(form.coxa),
        numero_calcado: Number(form.numero_calcado),
      });
      // O código de acesso pode ter sido gerado agora (primeiro cadastro) — recarrega o usuário.
      await recarregarUsuario();
      router.push('/painel');
    } catch (error) {
      setErro(getErrorMessage(error, 'Não foi possível salvar suas medidas.'));
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <div>
        <Header />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-xl bg-white p-8 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-[var(--color-text-dark)]">Minhas medidas</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormError message={erro} />
            <div className="grid grid-cols-2 gap-4">
              {CAMPOS.map(({ chave, label, step }) => (
                <Input
                  key={chave}
                  id={chave}
                  label={label}
                  type="number"
                  step={step}
                  min="0"
                  required
                  value={form[chave]}
                  onChange={(e) => handleChange(chave, e.target.value)}
                />
              ))}
            </div>
            <Button type="submit" loading={enviando}>
              Salvar medidas
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function MedidasPage() {
  return (
    <ProtectedRoute>
      <MedidasForm />
    </ProtectedRoute>
  );
}
