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

  return { login, isLoading };
}
