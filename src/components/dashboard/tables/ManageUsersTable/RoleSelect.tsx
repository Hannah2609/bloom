"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types/user";
import { UserTableRow } from "@/types/user";

interface RoleSelectProps {
  user: UserTableRow;
  onRoleChange?: (userId: string, newRole: Role) => Promise<void>;
}

export function RoleSelect({ user, onRoleChange }: RoleSelectProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleRoleChange = (newRole: string) => {
    if (onRoleChange) {
      startTransition(async () => {
        try {
          await onRoleChange(user.id, newRole as Role);
        } catch (error) {
          console.error("Error updating role:", error);
        }
      });
    }
  };

  return (
    <Select
      value={user.role}
      onValueChange={handleRoleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-32">
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="EMPLOYEE">Employee</SelectItem>
      </SelectContent>
    </Select>
  );
}
