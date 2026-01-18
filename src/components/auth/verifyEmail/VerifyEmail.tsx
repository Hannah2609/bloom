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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface VerifyEmailProps {
  defaultEmail?: string;
}

export function VerifyEmail({ defaultEmail = "" }: VerifyEmailProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);
  const router = useRouter();

  // Update email when defaultEmail changes
  useEffect(() => {
    if (defaultEmail) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail]);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    setVerificationLink(null);

    try {
      const response = await fetch("/api/auth/send-verification-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.message);

      // Development only - show verification link
      if (data.verificationLink) {
        setVerificationLink(data.verificationLink);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationClick = () => {
    if (verificationLink) {
      setOpen(false);
      router.push(verificationLink);
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
        <p className="cursor-pointer text-xs hover:underline text-muted-foreground">
          Resend verification email
        </p>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-8">
        <DialogHeader className="text-left mt-2">
          <DialogTitle>Verify your email</DialogTitle>
          <DialogDescription>
            Enter your email and we will send you a verification link.
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
            {isLoading ? "Sending..." : "Send Verification Link"}
          </Button>
        </div>

        {verificationLink && (
          <div className="mt-4 space-y-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-sm font-medium text-green-600">
              Development mode: Click button to verify email
            </p>
            <Button
              type="button"
              onClick={handleVerificationClick}
              variant="outline"
              className="w-full"
            >
              Go to Verify Email
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
