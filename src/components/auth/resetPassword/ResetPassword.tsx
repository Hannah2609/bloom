"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/forms/input";
import { Button } from "@/components/ui/button/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ResetPassword() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    setResetLink(null);

    try {
      const response = await fetch("/api/auth/send-reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.message);

      // Development only - show reset link
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetClick = () => {
    if (resetLink) {
      setOpen(false);
      router.push(resetLink);
    }
  };

  // So you can submit the form by pressing Enter in the email input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="absolute right-0 top-0 cursor-pointer text-xs hover:underline">
          Forgot password?
        </p>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-8">
        <DialogHeader className="text-left mt-2">
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email and we will send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>

        {resetLink && (
          <div className="mt-4 space-y-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-sm font-medium text-green-600">
              Development mode: Click button to reset password
            </p>
            <Button
              type="button"
              onClick={handleResetClick}
              variant="outline"
              className="w-full"
            >
              Go to Reset Password
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
