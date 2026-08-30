import { redirect } from 'next/navigation';

// Equivalente à rota coringa ("*") do React Router: qualquer caminho não
// mapeado redireciona para o login, em vez de mostrar uma página 404.
export default function NotFound() {
  redirect('/login');
}
