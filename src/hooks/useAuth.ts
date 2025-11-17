import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginSchema } from '@/lib/validation/validation';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginSchema) => {
    try {
      setIsLoading(true);
      toast.loading('Logging in...');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      toast.dismiss();
      toast.success(`Welcome back, ${result.user.firstName}!`, {
        duration: 3000,
      });

      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Something went wrong', {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      toast.loading('Logging out...');

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      toast.dismiss();
      toast.success('You are logged out', {
        duration: 2000,
      });

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to log out', { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, isLoading };
}
