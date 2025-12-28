"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { SetNewPassword } from "@/components/auth/resetPassword/SetNewPassword";
import { Loader2Icon } from "lucide-react";
import { Heading } from "@/components/ui/heading/heading";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        toast.error("Invalid reset link");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Invalid or expired reset token");
        }

        setIsTokenValid(true);
      } catch {
        toast.error("Invalid or expired reset link");
        router.push("/login");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, router]);

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="size-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isTokenValid || !token) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-base-200/50 p-8">
        <div className="space-y-2">
          <Heading level="h2" className="font-medium">
            Reset your password
          </Heading>
          <p className="text-sm text-muted-foreground">
            Please enter your new password
          </p>
        </div>
        <SetNewPassword token={token} />
      </div>
    </div>
  );
}
