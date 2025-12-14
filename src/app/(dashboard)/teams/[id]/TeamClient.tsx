"use client";

import { Heading } from "@/components/ui/heading/heading";
import { Team } from "@/generated/prisma/client";
import { PageLayout } from "@/components/ui/layout/dashboard/pageLayout/pageLayout";

interface TeamProps {
  team: Team;
}

export default function TeamClient({ team }: TeamProps) {
  return (
    <PageLayout>
      <Heading level="h1">{team.name}</Heading>
    </PageLayout>
  );
}
