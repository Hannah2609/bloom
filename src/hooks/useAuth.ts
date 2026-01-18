import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginSchema } from "@/lib/validation/validation";
import { useSession } from "@/contexts/SessionContext";

export function useAuth() {
  const router = useRouter();
  const { refetch } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // LOGIN
  const login = useCallback(
    async (data: LoginSchema): Promise<{ requiresVerification?: boolean }> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      try {
        setIsLoading(true);
        toast.loading("Logging in...");

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          // Handle verification requirement separately
          if (result.requiresVerification) {
            toast.dismiss();
            toast.error(
              result.error || "Please verify your email before logging in",
              {
                duration: 4000,
              }
            );
            return { requiresVerification: true };
          }
          throw new Error(result.error || "Something went wrong");
        }

        // Update session context after successful login
        await refetch();

        toast.dismiss();
        toast.success(`Welcome back, ${result.user.firstName}!`, {
          duration: 3000,
        });

        // Navigate after delay
        timeoutRef.current = setTimeout(() => {
          router.push("/home");
        }, 1000);
        return {};
      } catch (error) {
        toast.dismiss();
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
          {
            duration: 4000,
          }
        );
        throw error; // Re-throw for component handling
      } finally {
        setIsLoading(false);
      }
    },
    [refetch, router]
  );

  // LOGOUT
  const logout = useCallback(async () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      setIsLoading(true);
      toast.loading("Logging out...");

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Logout failed");
      }

      // Force refetch to clear session context
      await refetch();

      toast.dismiss();
      toast.success("You are logged out", {
        duration: 2000,
      });

      // Use replace to prevent back button navigation
      router.replace("/login");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to log out",
        { duration: 4000 }
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [refetch, router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { login, logout, isLoading };
}
