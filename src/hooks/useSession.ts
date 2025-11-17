import { useEffect, useState } from 'react';
import { SessionData } from '@/lib/session/session';

// Type definition for hvad hook'en returnerer
interface UseSessionReturn {
  isLoggedIn: boolean; // Om brugeren er logget ind
  user: SessionData['user'] | null; // Brugerens data eller null
  isLoading: boolean; // Om data stadig indlæses
  error: Error | null; // Eventuelle fejl der opstår
}

// Custom hook til at håndtere session state
export function useSession(): UseSessionReturn {
  // State til at holde session data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<SessionData['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Funktion der henter session data fra API'en
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
  }, []); // Kør kun én gang når komponenten indlæses

  return { isLoggedIn, user, isLoading, error };
}