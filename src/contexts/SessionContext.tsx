"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { SessionData } from "@/lib/session/session";

type SessionContextType = {
  isLoggedIn: boolean;
  user: SessionData["user"] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<SessionData["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef(false);

  const fetchSession = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.status}`);
      }

      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
      setUser(data.user);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []); // No dependencies needed

  // Initial fetch on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Refetch when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (!isFetchingRef.current) {
        fetchSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchSession]);

  // Listen for custom 'session-change' events
  useEffect(() => {
    const handleSessionChange = () => {
      if (!isFetchingRef.current) {
        fetchSession();
      }
    };

    window.addEventListener("session-change", handleSessionChange);
    return () =>
      window.removeEventListener("session-change", handleSessionChange);
  }, [fetchSession]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      isLoading,
      error,
      refetch: fetchSession,
    }),
    [isLoggedIn, user, isLoading, error, fetchSession]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
