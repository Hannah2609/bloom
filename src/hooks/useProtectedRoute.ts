import { useSession } from './useSession';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useProtectedRoute() {
  const router = useRouter();
  const { isLoggedIn, isLoading, user } = useSession();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  return { isLoggedIn, isLoading, user };
}