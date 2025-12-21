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
import { useRouter, usePathname } from "next/navigation";
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
  const isFetchingRef = useRef(false); // Use ref to prevent dependency loop
  const isLoggedInRef = useRef(false); // Track login state for focus handler
  const router = useRouter();
  const pathname = usePathname();

  const fetchSession = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/session", {
        cache: "no-store", // Ensure we always get fresh data
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.status}`);
      }

      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
      isLoggedInRef.current = data.isLoggedIn; // Update ref
      setUser(data.user);

      // If logged out and on protected route, redirect to login
      if (
        !data.isLoggedIn &&
        pathname &&
        !pathname.startsWith("/login") &&
        !pathname.startsWith("/signup") &&
        pathname !== "/"
      ) {
        router.replace("/login");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      setIsLoggedIn(false);
      isLoggedInRef.current = false;
      setUser(null);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [pathname, router]); // Add dependencies

  // Initial fetch on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Refetch when window gains focus (e.g., user switches tabs)
  // This ensures session is updated if user logs in/out in another tab
  useEffect(() => {
    const handleFocus = () => {
      // Always refetch on focus to catch session changes in other tabs
      if (!isFetchingRef.current) {
        fetchSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchSession]); // Only depend on fetchSession

  // Listen for custom 'session-change' events
  // This allows us to trigger refetch from other parts of the app
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
