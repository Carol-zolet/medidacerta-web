'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getMinhasMedidas } from '@/api/medidas';
import { deleteMe } from '@/api/users';
import { getErrorMessage } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { FormError } from '@/components/FormError';
import { Spinner } from '@/components/Spinner';
import { QrCodeModal } from '@/components/QrCodeModal';
import type { Medidas } from '@/types';

const LABELS_MEDIDAS: { chave: keyof Medidas; label: string; sufixo: string }[] = [
  { chave: 'busto', label: 'Busto', sufixo: 'cm' },
  { chave: 'torax', label: 'Tórax', sufixo: 'cm' },
  { chave: 'cintura', label: 'Cintura', sufixo: 'cm' },
  { chave: 'quadril', label: 'Quadril', sufixo: 'cm' },
  { chave: 'coxa', label: 'Coxa', sufixo: 'cm' },
  { chave: 'numeroCalcado', label: 'Número do calçado', sufixo: '' },
];

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function PainelConteudo() {
  const { usuario, logout } = useAuth();
  const [medidas, setMedidas] = useState<Medidas | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [mostrandoQrCode, setMostrandoQrCode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getMinhasMedidas()
      .then(setMedidas)
      .catch((error) => setErro(getErrorMessage(error)))
      .finally(() => setCarregando(false));
  }, []);

  async function handleCopiarCodigo() {
    if (!usuario?.codigoAcesso) return;
    try {
      await navigator.clipboard.writeText(usuario.codigoAcesso);
      toast.success('Código copiado para a área de transferência!');
    } catch {
      toast.error('Não foi possível copiar o código. Copie manualmente.');
    }
  }

  async function handleExcluir() {
    setExcluindo(true);
    setErro(null);
    try {
      await deleteMe();
      logout();
      router.push('/login');
    } catch (error) {
      setErro(getErrorMessage(error, 'Não foi possível excluir sua conta.'));
      setExcluindo(false);
      setConfirmandoExclusao(false);
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
      <div className="mx-auto max-w-2xl px-4 py-10">
        <FormError message={erro} />

        <div className="mt-4 rounded-xl border border-[var(--color-accent-gold)]/25 bg-white p-8 shadow-md">
          <h1 className="font-title text-2xl font-bold text-[var(--color-text-title)]">Olá, {usuario?.nome}!</h1>

          <div className="mt-4">
            <span className="text-sm font-medium text-[var(--color-text-title)]">
              Código de acesso
            </span>
            {usuario?.codigoAcesso ? (
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="rounded-md border border-[var(--color-accent-gold)]/40 bg-[var(--color-bg-highlight)] px-4 py-2 text-xl font-bold tracking-wide text-[var(--color-text-title)]">
                  {usuario.codigoAcesso}
                </span>
                <Button type="button" variant="secondary" onClick={handleCopiarCodigo}>
                  Copiar
                </Button>
                <Button type="button" variant="secondary" onClick={() => setMostrandoQrCode(true)}>
                  Ver QR Code
                </Button>
              </div>
            ) : (
              <p className="mt-1 text-sm text-[var(--color-text-body)]">
                Seu código será gerado assim que você cadastrar suas medidas.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--color-accent-gold)]/25 bg-white p-8 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-title text-xl font-bold text-[var(--color-text-title)]">Minhas medidas</h2>
            <Button variant="secondary" onClick={() => router.push('/medidas')}>
              {medidas ? 'Editar medidas' : 'Cadastrar medidas'}
            </Button>
          </div>

          {medidas ? (
            <>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {LABELS_MEDIDAS.map(({ chave, label, sufixo }) => (
                  <div key={chave}>
                    <dt className="text-sm text-slate-500">{label}</dt>
                    <dd className="font-semibold text-[var(--color-text-body)]">
                      {medidas[chave]} {sufixo}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-slate-500">
                Última atualização: {formatarData(medidas.atualizadoEm)}
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-body)]">
              Você ainda não cadastrou suas medidas.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-[var(--color-accent-gold)]/25 bg-white p-8 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-title text-xl font-bold text-[var(--color-text-title)]">
              Histórico de atividades
            </h2>
            <Button variant="secondary" onClick={() => router.push('/historico')}>
              Ver histórico
            </Button>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-body)]">
            Veja quando suas medidas foram alteradas e quando seu código de acesso foi consultado.
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--color-accent-gold)]/25 bg-white p-8 shadow-md">
          <h2 className="font-title text-xl font-bold text-[var(--color-text-title)]">Zona de risco</h2>
          <p className="mt-1 text-sm text-[var(--color-text-body)]">
            Excluir sua conta remove permanentemente seus dados e suas medidas cadastradas.
          </p>

          {confirmandoExclusao ? (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--color-danger)]">Tem certeza?</span>
              <Button variant="danger" onClick={handleExcluir} loading={excluindo}>
                Sim, excluir
              </Button>
              <Button
                variant="secondary"
                onClick={() => setConfirmandoExclusao(false)}
                disabled={excluindo}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button variant="danger" className="mt-4" onClick={() => setConfirmandoExclusao(true)}>
              Excluir meus dados
            </Button>
          )}
        </div>
      </div>

      {mostrandoQrCode && usuario?.codigoAcesso && (
        <QrCodeModal
          url={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/medidas/${usuario.codigoAcesso}`}
          codigo={usuario.codigoAcesso}
          onClose={() => setMostrandoQrCode(false)}
        />
      )}
    </div>
  );
}

export default function PainelPage() {
  return (
    <ProtectedRoute>
      <PainelConteudo />
    </ProtectedRoute>
  );
}
