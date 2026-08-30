# medidacerta-web

Frontend React do MedidaCerta — SPA em React + TypeScript + Vite, com Tailwind CSS, consumindo
a API do backend NestJS (`medidacerta-api`). Projeto acadêmico (Fase 2).

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router v6
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

Edite `.env` e defina `VITE_API_URL` apontando para o backend:

- **Local:** `VITE_API_URL=http://localhost:3000` (padrão do `.env.example`)
- **Produção:** `VITE_API_URL=https://sua-api-em-producao.exemplo.com`

### 3. Rodar o backend

Este frontend depende da API `medidacerta-api` rodando (veja o README daquele repositório para
subir o Postgres via Docker e rodar `npm run start:dev`). Confirme que a API está de pé em
`http://localhost:3000` (ou na URL configurada em `VITE_API_URL`) antes de usar o app.

### 4. Rodar o frontend em modo dev

```bash
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
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

Rotas protegidas redirecionam para `/login` automaticamente se não houver um token válido, ou se
qualquer requisição autenticada retornar 401 (sessão expirada/inválida).
