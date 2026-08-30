'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, ...rest },
  ref,
) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-text-dark)]">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-[var(--color-text-body)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
        {...rest}
      />
    </div>
  );
});
