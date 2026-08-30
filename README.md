# medidacerta-web

Frontend do MedidaCerta — SPA em Next.js (App Router) + TypeScript, com Tailwind CSS, consumindo
a API do backend NestJS (`medidacerta-api`). Projeto acadêmico (Fase 2).

> Migrado de React + Vite para Next.js mantendo o mesmo comportamento funcional e visual. É um
> dashboard atrás de autenticação: não usa SSR/SEO, o JWT continua no `localStorage` e a proteção
> de rota continua sendo feita em componente client-side (sem middleware/cookies do Next.js).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Axios

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a variável de ambiente

```bash
cp .env.example .env
```

Edite `.env` e defina `NEXT_PUBLIC_API_URL` apontando para o backend (o prefixo `NEXT_PUBLIC_`
é exigido pelo Next.js para variáveis expostas ao navegador):

- **Local:** `NEXT_PUBLIC_API_URL=http://localhost:3000` (padrão do `.env.example`)
- **Produção:** `NEXT_PUBLIC_API_URL=https://sua-api-em-producao.exemplo.com`

### 3. Rodar o backend

Este frontend depende da API `medidacerta-api` rodando (veja o README daquele repositório para
subir o Postgres via Docker e rodar `npm run start:dev`). Confirme que a API está de pé em
`http://localhost:3000` (ou na URL configurada em `NEXT_PUBLIC_API_URL`) antes de usar o app.

### 4. Rodar o frontend em modo dev

```bash
npm run dev
```

A aplicação sobe em `http://localhost:5173` (porta fixada para não colidir com o backend, que
usa a 3000).

## Build de produção

```bash
npm run build
npm run start
```

## Fluxo da aplicação

1. `/cadastro` — cria a conta (nome, sobrenome, e-mail, senha) e redireciona para `/login`.
2. `/login` — autentica e guarda o JWT no `localStorage`.
3. `/medidas` (rota protegida) — cadastra/edita busto, tórax, cintura, quadril, coxa e número
   do calçado. Na primeira vez, o backend gera um código de acesso.
4. `/painel` (rota protegida) — mostra nome, código de acesso (com botão de copiar), as medidas
   cadastradas e a data da última atualização. Permite editar as medidas ou excluir a conta.
5. `/esqueci-senha` → `/redefinir-senha?token=...` — fluxo de recuperação de senha. Em ambiente
   de desenvolvimento o token é apenas logado no console do backend (não há envio real de e-mail
   neste MVP).

Rotas protegidas (`/medidas`, `/painel`) usam um componente `ProtectedRoute` (client-side) que
redireciona para `/login` se não houver um token válido, ou se qualquer requisição autenticada
retornar 401 (sessão expirada/inválida). Qualquer caminho não mapeado também redireciona para
`/login`.

## Estrutura

```
src/
  app/            # rotas (App Router): cada pasta = uma URL, page.tsx = a tela
  api/            # cliente HTTP (axios) e chamadas à API, por domínio
  components/     # componentes de UI reutilizáveis
  context/        # AuthContext (sessão, token, usuário logado)
  routes/         # ProtectedRoute (guarda de rota client-side)
  types/          # tipos compartilhados com a API
```
