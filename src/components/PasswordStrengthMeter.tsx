'use client';

interface NivelForca {
  label: string;
  corBarra: string;
  corTexto: string;
  segmentosPreenchidos: number;
}

const NIVEIS: Record<'fraca' | 'media' | 'forte', NivelForca> = {
  fraca: {
    label: 'Senha fraca',
    corBarra: 'bg-[var(--color-danger)]',
    corTexto: 'text-[var(--color-danger)]',
    segmentosPreenchidos: 1,
  },
  media: {
    label: 'Senha média',
    corBarra: 'bg-[var(--color-accent-gold)]',
    corTexto: 'text-[var(--color-accent-gold)]',
    segmentosPreenchidos: 2,
  },
  forte: {
    label: 'Senha forte',
    corBarra: 'bg-emerald-600',
    corTexto: 'text-emerald-700',
    segmentosPreenchidos: 3,
  },
};

/**
 * Heurística simples (sem dependência externa): pontua comprimento e
 * variedade de caracteres. Não substitui as regras reais do backend (min. 8
 * caracteres + 1 número) — é só um feedback visual complementar.
 */
function calcularNivel(senha: string): NivelForca | null {
  if (!senha) return null;

  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (senha.length >= 12) pontos++;
  if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
  if (/\d/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  if (pontos <= 1) return NIVEIS.fraca;
  if (pontos <= 3) return NIVEIS.media;
  return NIVEIS.forte;
}

export function PasswordStrengthMeter({ senha }: { senha: string }) {
  const nivel = calcularNivel(senha);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((indice) => (
          <div
            key={indice}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              nivel && indice < nivel.segmentosPreenchidos ? nivel.corBarra : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      {nivel && <span className={`text-xs font-medium ${nivel.corTexto}`}>{nivel.label}</span>}
    </div>
  );
}
