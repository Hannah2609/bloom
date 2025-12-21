"use client";

import React, { useState } from "react";
import { Heading } from "@/components/ui/heading/heading";
import { Button } from "@/components/ui/button/button";
import { PlusIcon } from "lucide-react";
import { TeamsCard } from "@/components/dashboard/cards/teamsCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import CreateTeamForm from "@/components/dashboard/forms/CreateTeamForm";
import { useRouter } from "next/navigation";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";

interface Team {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TeamsClientProps {
  initialTeams: Team[];
  isAdmin: boolean;
}

export default function TeamsClient({
  initialTeams,
  isAdmin,
}: TeamsClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const teams = initialTeams;

  // Refresh teams after creating a new one
  const handleTeamCreated = () => {
    setIsOpen(false);
    // Refresh the page to get updated data from server
    router.refresh();
  };

  return (
    <>
      <PageLayout>
        <div className="mb-8 flex items-center justify-between">
          <Heading level="h1">Teams</Heading>
          {isAdmin && (
            <Button size="lg" onClick={() => setIsOpen(true)}>
              <PlusIcon className="size-4" />
              Create new team
            </Button>
          )}
        </div>
        {teams.length === 0 ? (
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
      </PageLayout>
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
