"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isVerifying, setIsVerifying] = useState(true);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple calls (e.g., from React Strict Mode)
    if (hasVerifiedRef.current) {
      return;
    }

    const verifyEmail = async () => {
      if (!token) {
        toast.error("Invalid verification link");
        router.push("/login");
        return;
      }

      hasVerifiedRef.current = true;

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Invalid or expired verification token");
        }

        // Success - redirect to login with query parameter to show toast
        router.push("/login?verified=true");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Invalid or expired verification link"
        );
        router.push("/login");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return null;
}

