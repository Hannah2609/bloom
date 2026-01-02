"use client";

import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProfileInfoProps {
  firstName: string;
  lastName: string;
  role: string;
  companyName: string;
}

export function ProfileInfo({
  firstName,
  lastName,
  role,
  companyName,
}: ProfileInfoProps) {
  const { logout } = useAuth();

  return (
    <div className="space-y-2 text-center">
      <Heading level="h2">
        {firstName} {lastName}
      </Heading>
      <p className="text-muted-foreground text-sm">{role}</p>
      <p className="text-muted-foreground mt-1 text-sm">{companyName}</p>

      <Button onClick={logout} className="mt-4 min-w-48" type="button">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
