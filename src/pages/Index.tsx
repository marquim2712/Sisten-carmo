// Sistema de Assistência Técnica
// Página principal - redireciona para o dashboard após login

import { useAuth } from '../contexts/AuthContext';
import { Dashboard } from '../components/Dashboard';
import { Login } from '../components/Login';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
};

export default Index;
