"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/forms/input";
import { Badge } from "@/components/ui/badge/badge";
import { X, Search, Users } from "lucide-react";

export interface Team {
  id: string;
  name: string;
  memberCount?: number;
}

interface TeamSearchProps {
  selectedTeams: Team[];
  onTeamsChange: (teams: Team[]) => void;
  label?: string;
}

export default function TeamSearch({
  selectedTeams,
  onTeamsChange,
  label = "Search Teams",
}: TeamSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTeams = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `/api/dashboard/teams/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to search teams");
      }

      const data = await response.json();
      setSearchResults(data.teams || []);
    } catch (error) {
      console.error("Error searching teams:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTeams(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchTeams]);

  const handleSelectTeam = (team: Team) => {
    // Check if already selected
    if (selectedTeams.some((t) => t.id === team.id)) return;

    onTeamsChange([...selectedTeams, team]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveTeam = (teamId: string) => {
    onTeamsChange(selectedTeams.filter((t) => t.id !== teamId));
  };

  // Filter out already selected teams from results
  const filteredResults = searchResults.filter(
    (team) => !selectedTeams.some((selected) => selected.id === team.id)
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && (
          <div className="border rounded-md bg-background shadow-lg max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Searching...
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="divide-y">
                {filteredResults.map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => handleSelectTeam(team)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-muted-foreground" />
                      <span className="font-medium">{team.name}</span>
                    </div>
                    {team.memberCount !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {team.memberCount} member
                        {team.memberCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No teams found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Teams */}
      {selectedTeams.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Selected Teams ({selectedTeams.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTeams.map((team) => (
              <Badge
                key={team.id}
                icon={<Users className="size-3" />}
                className="gap-1 pr-1"
              >
                {team.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTeam(team.id)}
                  className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
