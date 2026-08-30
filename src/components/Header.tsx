import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export function Header() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <span className="text-lg font-bold text-[var(--color-text-dark)]">MedidaCerta</span>
      <div className="flex items-center gap-4">
        {usuario && <span className="text-sm text-[var(--color-text-body)]">{usuario.nome}</span>}
        <Button variant="secondary" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </header>
  );
}
