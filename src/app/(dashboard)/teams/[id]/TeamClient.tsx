"use client";

import AddTeamMemberForm from "@/components/dashboard/forms/addTeamMemberForm";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button/button";
import { Heading } from "@/components/ui/heading/heading";
import {
  SheetDescription,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
} from "@/components/ui/sheet";
import { Team } from "@/types/team";
import { Role } from "@/types/user";

import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ExtendedTeam extends Team {
  members: {
    id: string;
    userId: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string | null;
    };
    role: Role;
    joinedAt: Date;
    leftAt: Date | null;
  }[];
}import { PageLayout } from "@/components/ui/layout/dashboard/pageLayout/pageLayout";

interface TeamProps {
  team: ExtendedTeam;
  isAdmin: boolean;
}

export default function TeamClient({ team, isAdmin }: TeamProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <section className="p-8">
        <Heading level="h2">{team.name}</Heading>

        <div className="space-y-4 p-4 border rounded-lg bg-base-200 dark:bg-card mt-4 max-w-md">
          <div className="space-y-2 flex items-center justify-between">
            <Heading level="h3">Members</Heading>
            {isAdmin && (
              <Button size="sm" onClick={() => setIsOpen(true)}>
                <PlusIcon className="size-4" />
                Add members
              </Button>
            )}
          </div>
          {team.members.length === 0 ? (
            <p className="text-sm text-base-500">No members yet</p>
          ) : (
            <ul className="flex flex-col gap-2 space-y-2">
              {team.members.map((member) => (
                <li key={member.id} className="flex items-center gap-2">
                  <Avatar className="size-6">
                    {member.user.avatar ? (
                      <AvatarImage
                        src={member.user.avatar}
                        alt={member.user.firstName}
                      />
                    ) : (
                      <AvatarFallback />
                    )}
                  </Avatar>
                  <p className="text-sm text-base-500">
                    {member.user.firstName} {member.user.lastName} -{" "}
                  </p>
                  <p className="text-sm text-base-500">{member.user.email}</p>
                  {isAdmin && (
                    <Button size="icon" variant="outline">
                      <TrashIcon />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {isAdmin && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add Members</SheetTitle>
              <SheetDescription>
                Search for users in your company to add to {team.name}
              </SheetDescription>
            </SheetHeader>
            <AddTeamMemberForm
              teamId={team.id}
              onSuccess={() => {
                setIsOpen(false);
                router.refresh();
              }}
            />
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
