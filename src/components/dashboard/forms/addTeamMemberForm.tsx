"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UserSearch, { User } from "./UserSearch";

interface AddTeamMemberFormProps {
  teamId: string;
  onSuccess?: () => void;
}

export default function AddTeamMemberForm({
  teamId,
  onSuccess,
}: AddTeamMemberFormProps) {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMembers = useCallback(async () => {
    if (selectedUsers.length === 0) return;

    setIsAdding(true);
    toast.loading(`Adding ${selectedUsers.length} member(s)...`);

    try {
      const response = await fetch(`/api/dashboard/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: selectedUsers.map((u) => u.id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add members");
      }

      toast.dismiss();
      toast.success(
        `Successfully added ${selectedUsers.length} member(s) to the team!`,
        { duration: 3000 }
      );

      setSelectedUsers([]);
      router.refresh();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Failed to add members",
        { duration: 4000 }
      );
    } finally {
      setIsAdding(false);
    }
  }, [selectedUsers, teamId, router, onSuccess]);

  return (
    <div className="space-y-6 mt-6">
      {selectedUsers.length > 0 && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleAddMembers}
            disabled={isAdding}
            size="sm"
          >
            {isAdding ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              `Add ${selectedUsers.length} member${selectedUsers.length > 1 ? "s" : ""}`
            )}
          </Button>
        </div>
      )}

      <UserSearch
        selectedUsers={selectedUsers}
        onUsersChange={setSelectedUsers}
        excludeTeamId={teamId}
        label="Search Members"
      />
    </div>
  );
}
