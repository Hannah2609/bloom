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
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResetLink(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.message);
      // We show the reset link only for development purposes
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="absolute right-0 top-0 hover:underline text-xs cursor-pointer">
          Forgot password?
        </p>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="text-left">
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email and we will send you a reset link.
          </DialogDescription>
        </DialogHeader>

        <div onSubmit={handleSubmit} className="space-y-4" role="form">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>

        {resetLink && (
          <div className="mt-4 text-sm text-green-600">
            Reset link (development only):
            <a href={resetLink} className="underline break-all" target="_blank">
              Click here to reset
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
