"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);
      setUser(data.user);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{ isLoggedIn, user, isLoading, error, refetch: fetchSession }}
    >
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
