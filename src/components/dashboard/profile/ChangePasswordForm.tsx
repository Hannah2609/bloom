"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/forms/label"; // ← Skift her
import { PasswordInput } from "@/components/ui/forms/passwordInput";
import { Heading } from "@/components/ui/heading/heading";
import { toast } from "sonner";

interface ChangePasswordFormProps {
  userId: string;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        // ← Fjernet /password
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setIsChanging(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsChanging(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-4 border-t pt-6">
      <Heading level="h3">Change Password</Heading>

      {!isChanging ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsChanging(true)}
        >
          Change Password
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isUpdating}
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isUpdating}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isUpdating}
              autoComplete="new-password"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handlePasswordChange}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
