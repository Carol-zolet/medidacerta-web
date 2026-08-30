'use client';

import { useRouter } from 'next/navigation';

/**
 * Botão de voltar: usa o histórico do navegador quando existe uma página
 * anterior de fato (evita "voltar" para fora do app em acesso direto/refresh),
 * caindo para uma rota lógica fixa (`fallbackHref`) nos demais casos.
 */
export function BackButton({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter();

  function handleClick() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Voltar"
      className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M12.5 15L7.5 10L12.5 5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Voltar
    </button>
  );
}
