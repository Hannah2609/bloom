"use client";

import { Heading } from "@/components/ui/heading/heading";
import { Team } from "@/generated/prisma/client";

interface TeamProps {
  team: Team;
}

export default function TeamClient({ team }: TeamProps) {
  return (
    <section className="p-8">
      <Heading level="h2">{team.name}</Heading>
    </section>
  );
}
