'use client';

export function Spinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-bg-highlight)] border-t-[var(--color-primary)]" />
    </div>
  );
}
