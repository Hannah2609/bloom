"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignupSchema } from "@/lib/validation/validation";

export function useSignup() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signup = async (data: SignupSchema): Promise<
    | { success: true; verificationLink?: string }
    | { success: false }
  > => {
    try {
      setIsSubmitting(true);
      toast.loading("Creating your account...");

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create account");
      }

      toast.dismiss();
      toast.success(
        "Account created! Please check your email for a verification link.",
        {
          duration: 5000,
        }
      );

      // Store verification link for display in signup form
      if (result.verificationLink) {
        return { success: true, verificationLink: result.verificationLink };
      }

      router.push("/login");
      return { success: true };
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to create account",
        {
          duration: 4000,
        }
      );

      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { signup, isSubmitting };
}
