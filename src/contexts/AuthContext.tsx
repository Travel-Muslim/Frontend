import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getProfile, type User } from '../api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const userProfile = await getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Gagal memuat profil user:', error);
      // Fallback ke data dari localStorage jika ada
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (parseError) {
          console.error('Gagal parse user dari localStorage:', parseError);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cek apakah ada token di localStorage
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user && !!localStorage.getItem('token');
  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.email?.toLowerCase().includes('admin') || false;

  const value: AuthContextType = {
    user,
    loading,
    setUser,
    refreshUser,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook untuk memudahkan pengecekan admin
export function useIsAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin;
}

// Hook untuk memudahkan pengecekan autentikasi
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}