import { useEffect, useState } from 'react';
import { AuthService } from '../services/authService';

export function useAuth() {

  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {

    AuthService.me()

      .then(() => {
        setIsAuthenticated(true);
      })

      .catch(() => {
        setIsAuthenticated(false);
      })

      .finally(() => {
        setLoading(false);
      });

  }, []);

  return {
    loading,
    isAuthenticated,
  };
}