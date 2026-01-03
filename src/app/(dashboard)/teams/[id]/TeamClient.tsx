"use client";

import AddTeamMemberForm from "@/components/dashboard/forms/AddTeamMemberForm";
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
import { TeamWithMembers } from "@/types/team";
import { SurveyListItem } from "@/types/survey";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageLayout } from "@/components/dashboard/layout/pageLayout";
import { UserSurveyCard } from "@/components/dashboard/cards/UserSurveyCard";
import { TeamHappinessCard } from "@/components/dashboard/cards/TeamHappinessCard";

interface TeamClientProps {
  team: TeamWithMembers;
  isAdmin: boolean;
  activeSurveys: SurveyListItem[];
  completedSurveyIds: string[];
}

export default function TeamClient({
  team,
  isAdmin,
  activeSurveys,
  completedSurveyIds,
}: TeamClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <PageLayout>
        <Heading level="h1">{team.name}</Heading>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="space-y-4 rounded-lg border bg-sidebar p-4 lg:sticky lg:top-4">
              <div className="flex items-center justify-between">
                <Heading level="h2">Members</Heading>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(true)}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                )}
              </div>

              {team.members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members yet</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {team.members.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/50"
                    >
                      <Avatar className="size-8">
                        {member.user.avatar ? (
                          <AvatarImage
                            src={member.user.avatar}
                            alt={member.user.firstName}
                          />
                        ) : (
                          <AvatarFallback />
                        )}
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.user.email}
                        </p>
                      </div>
                      {isAdmin && (
                        <Button size="icon" variant="ghost" className="size-8">
                          <TrashIcon className="size-4" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
          <div className="lg:col-span-3 space-y-6">
            <TeamHappinessCard teamId={team.id} teamName={team.name} />

            {activeSurveys.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div>
                  <Heading level="h2">Active Surveys</Heading>
                  <p className="mt-1 text-muted-foreground">
                    {activeSurveys.length}{" "}
                    {activeSurveys.length === 1 ? "survey" : "surveys"}{" "}
                    available for this team
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {activeSurveys.map((survey) => (
                    <UserSurveyCard
                      key={survey.id}
                      survey={survey}
                      hasCompleted={completedSurveyIds.includes(survey.id)}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                <p className="text-center text-muted-foreground">
                  No active surveys for this team yet
                </p>
              </div>
            )}
          </div>
        </div>
      </PageLayout>

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
