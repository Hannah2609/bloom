"use client";

import React, { useState } from "react";
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

const teams = [
  {
    id: 1,
    name: "Team 1",
    members: 10,
  },
  {
    id: 2,
    name: "Team 2",
    members: 20,
  },
  {
    id: 3,
    name: "Team 3",
    members: 30,
  },
];

function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="p-8">
        <div className="my-8 flex items-center justify-between">
          <Heading level="h2">Teams</Heading>
          <Button size="lg" onClick={() => setIsOpen(true)}>
            <PlusIcon className="size-4" />
            Create new team
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamsCard key={team.id} team={team} />
          ))}
        </div>
      </section>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Create New Team</SheetTitle>
            <SheetDescription>
              Fill in the details to create a new team.
            </SheetDescription>
          </SheetHeader>
          {/* form */}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Page;
