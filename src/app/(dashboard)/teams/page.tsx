"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { PlusIcon } from "lucide-react";
import { TeamsCard } from "@/components/dashboard/teamsCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import CreateTeamForm from "@/components/dashboard/forms/createTeamForm";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import { Role } from "@/generated/prisma/enums";

interface Team {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

function Page() {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === Role.ADMIN;

  // Fetch teams when component mounts
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dashboard/teams");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch teams");
      }

      setTeams(data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load teams"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh teams after creating a new one
  const handleTeamCreated = () => {
    setIsOpen(false);
    fetchTeams();
  };

  return (
    <>
      <section className="p-8">
        <div className="my-8 flex items-center justify-between">
          <Heading level="h2">Teams</Heading>
          {isAdmin && (
            <Button size="lg" onClick={() => setIsOpen(true)}>
              <PlusIcon className="size-4" />
              Create new team
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4 text-center">
              {isAdmin
                ? "No teams yet - create your first team now!"
                : "Not a member of any teams yet - contact your manager if that is a mistake"}
            </p>
            {isAdmin && (
              <Button onClick={() => setIsOpen(true)}>
                <PlusIcon className="size-4" />
                Create your first team
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamsCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </section>
      {isAdmin && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create New Team</SheetTitle>
              <SheetDescription>
                Fill in the details to create a new team.
              </SheetDescription>
            </SheetHeader>
            <div className="flex h-full items-center">
              <CreateTeamForm onSuccess={handleTeamCreated} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

export default Page;
