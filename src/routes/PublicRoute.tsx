import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import { paths } from './paths';

type Props = {
  children: React.ReactNode;
};

export function PublicRoute({
  children,
}: Props) {

  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Carregando...
        </h1>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={paths.home}
        replace
      />
    );
  }

  return children;
}