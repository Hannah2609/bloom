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
import { Team } from "@/types/team";

interface TeamsClientProps {
  teams: Team[];
  isAdmin: boolean;
}

export default function TeamsClient({ teams, isAdmin }: TeamsClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleTeamCreated = () => {
    setIsOpen(false);
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
          <p className="mt-12 text-muted-foreground">
            {isAdmin
              ? "No teams yet - create your first team now!"
              : "Not a member of any teams yet - contact your manager if that is a mistake"}
          </p>
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
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Create New Team</SheetTitle>
              <SheetDescription>
                Fill in the details to create a new team.
              </SheetDescription>
            </SheetHeader>
            <div className="flex h-full items-center overflow-y-scroll">
              <CreateTeamForm onSuccess={handleTeamCreated} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
