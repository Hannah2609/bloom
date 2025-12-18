"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/forms/input";
import { Badge } from "@/components/ui/badge/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { X, Search, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/forms/label";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

interface UserSearchProps {
  selectedUsers: User[];
  onUsersChange: (users: User[]) => void;
  excludeTeamId?: string;
  label?: string;
}

export default function UserSearch({
  selectedUsers,
  onUsersChange,
  excludeTeamId,
  label = "Search Members",
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = excludeTeamId
          ? `/api/dashboard/users/search?q=${encodeURIComponent(searchQuery)}&excludeTeamId=${excludeTeamId}`
          : `/api/dashboard/users/search?q=${encodeURIComponent(searchQuery)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setSearchResults(
          (data.users || []).filter(
            (user: User) => !selectedUsers.some((su) => su.id === user.id)
          )
        );
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, excludeTeamId, selectedUsers]);

  const handleSelectUser = useCallback(
    (user: User) => {
      if (!selectedUsers.some((u) => u.id === user.id)) {
        onUsersChange([...selectedUsers, user]);
        setSearchQuery("");
        setSearchResults([]);
      }
    },
    [selectedUsers, onUsersChange]
  );

  const handleRemoveUser = useCallback(
    (userId: string) => {
      onUsersChange(selectedUsers.filter((u) => u.id !== userId));
    },
    [selectedUsers, onUsersChange]
  );

  return (
    <div className="space-y-3">
      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Selected ({selectedUsers.length})
          </p>
          <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30">
            {selectedUsers.map((user) => (
              <Badge
                key={user.id}
                className="flex items-center gap-1.5 pr-1 py-1.5"
              >
                <Avatar className="h-4 w-4">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-[10px]">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveUser(user.id)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="user-search" className="text-sm font-medium mb-2">
          {label}
        </Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="user-search"
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {searchQuery && (
          <div className="relative">
            {isSearching ? (
              <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md p-4 text-center">
                <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() && !isSearching ? (
              <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md p-4 text-center text-sm text-muted-foreground">
                No users found
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
