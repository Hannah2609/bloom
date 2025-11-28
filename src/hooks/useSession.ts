import { useEffect, useState } from 'react';
import { SessionData } from '@/lib/session/session';

type SessionResponse = {
  isLoggedIn: boolean;
  user: SessionData['user'] | null;
  isLoading: boolean;
  error: Error | null;
};

export function useSession(): SessionResponse {
  // States to hold session data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<SessionData['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetches session data
    async function fetchSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, []); // Run only once when the component mounts

  return { isLoggedIn, user, isLoading, error };
}
