import React from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "./card";
import { ArrowRight, PencilIcon, UsersIcon } from "lucide-react";
import { Heading } from "@/components/ui/heading/heading";
import { Badge } from "@/components/ui/badge/badge";
import Link from "next/link";

interface TeamsCardProps {
  team: {
    id: number;
    name: string;
    members: number;
  };
}

export function TeamsCard({ team }: TeamsCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="group hover:border-primary-300 dark:hover:border-base-700 cursor-pointer">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>
            <Heading level="h3" className="font-normal! text-2xl!">
              {team.name}
            </Heading>
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-12 flex justify-between items-center">
          <Badge icon={<UsersIcon className="size-3" />}>
            {team.members} members
          </Badge>
          <div className="flex items-center gap-2">
            {/* <p className="text-sm font-medium">View team</p> */}
            <ArrowRight className="size-5 group-hover:translate-x-2 group-hover:size-5.5 transition-transform duration-300 text-muted-foreground" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
