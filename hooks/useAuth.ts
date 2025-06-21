import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { LoginCredentials, RegisterCredentials } from '../types/auth';

export function useAuth() {
  const router = useRouter();
  const { login: setAuth, logout: clearAuth, isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Explicitly use /api/auth/login to ensure correct path
      const response = await api.post('/api/auth/login', credentials);
      const { user, token } = response.data;
      
      setAuth(user, token);
      router.push('/dashboard');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Explicitly use /api/auth/register to ensure correct path
      const response = await api.post('/api/auth/register', credentials);
      const { user, token } = response.data;
      
      setAuth(user, token);
      router.push('/dashboard');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to register';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
