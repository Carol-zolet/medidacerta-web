import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
  secondary:
    'bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-bg-light)]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`rounded-md px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
}
