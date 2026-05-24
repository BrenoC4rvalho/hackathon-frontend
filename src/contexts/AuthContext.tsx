import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AuthService, type UserResponse } from '../services/authService';

type AuthContextType = {
  loading: boolean;
  isAuthenticated: boolean;
  user: UserResponse | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserResponse | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const data = await AuthService.me();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated: !!user,
        user,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
}
