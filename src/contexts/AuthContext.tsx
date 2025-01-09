import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { AuthService } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });
  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('refreshToken');
  });

  useEffect(() => {
    console.log('accessToken', accessToken);
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await AuthService.signIn({ email, password });
    console.log('response', response);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const response = await AuthService.signUp({ email, password });
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
  }, []);

  const signOut = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const value = {
    isAuthenticated: !!accessToken,
    accessToken,
    refreshToken,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 