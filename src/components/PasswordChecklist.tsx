'use client';

const TEM_8_CARACTERES = (senha: string) => senha.length >= 8;
const TEM_NUMERO = (senha: string) => /\d/.test(senha);

/** Mesmas regras do backend (MinLength(8) + Matches(/\d/) em RegisterDto/ResetPasswordDto). */
export function senhaValida(senha: string): boolean {
  return TEM_8_CARACTERES(senha) && TEM_NUMERO(senha);
}

function Item({ ok, children }: { ok: boolean; children: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? 'text-emerald-700' : 'text-slate-500'}`}>
      <span aria-hidden="true">{ok ? '✓' : '○'}</span>
      {children}
    </li>
  );
}

export function PasswordChecklist({ senha }: { senha: string }) {
  return (
    <ul className="flex flex-col gap-0.5 text-sm">
      <Item ok={TEM_8_CARACTERES(senha)}>Mínimo de 8 caracteres</Item>
      <Item ok={TEM_NUMERO(senha)}>Pelo menos 1 número</Item>
    </ul>
  );
}
