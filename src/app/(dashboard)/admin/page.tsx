"use client";

import { ManageUsersTable } from "@/components/tables/ManageUsersTable/ManageUsersTable";
import { Role } from "@/generated/prisma/enums";
import { UserTableRow } from "@/types/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminPage() {
  const [users, setUsers] = useState<UserTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/dashboard/users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      const response = await fetch(`/api/dashboard/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update role");
      }

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      // Success toast
      toast.success("Role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update role. Please try again."
      );
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      // Remove user from local state
      setUsers((prev) => prev.filter((user) => user.id !== userId));

      // Success toast
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete user. Please try again."
      );
      throw error;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage users and their roles
        </p>
      </div>
      <ManageUsersTable
        users={users}
        onRoleChange={handleRoleChange}
        onDeleteUser={handleDeleteUser}
        isLoading={isLoading}
      />
    </div>
  );
}
