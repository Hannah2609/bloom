import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card/card";
import { ArrowRight, PencilIcon, UsersIcon } from "lucide-react";
import { Heading } from "@/components/ui/heading/heading";
import { Badge } from "@/components/ui/badge/badge";
import Link from "next/link";

interface TeamsCardProps {
  team: {
    id: string;
    name: string;
    memberCount: number;
  };
}

export function TeamsCard({ team }: TeamsCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="group hover:border-primary-300 dark:hover:border-base-700 cursor-pointer">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>
            <Heading level="h2">
              {team.name}
            </Heading>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center justify-between pt-12">
          <Badge icon={<UsersIcon className="size-3" />}>
            {team.memberCount} members
          </Badge>
          <div className="flex items-center gap-2">
            <ArrowRight className="text-muted-foreground size-5 transition-transform duration-300 group-hover:size-5.5 group-hover:translate-x-2" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
