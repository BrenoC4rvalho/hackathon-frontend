import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { paths } from './paths';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

type Props = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: Props) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to={paths.home} replace />;
  }

  return children;
}
