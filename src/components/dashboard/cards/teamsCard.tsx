import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card/card";
import { ArrowRight, ArrowUpRight, UsersIcon } from "lucide-react";
import { Heading } from "@/components/ui/heading/heading";
import { Badge } from "@/components/ui/badge/badge";
import Link from "next/link";
import { Team } from "@/types/team";

interface TeamsCardProps {
  team: Team;
}

export function TeamsCard({ team }: TeamsCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="group relative hover:border-primary-300 dark:hover:border-base-700 cursor-pointer">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>
            <p className="text-sm font-medium text-muted-foreground">Team</p>
            <Heading level="h2" className="text-2xl font-semibold">
              {team.name}
            </Heading>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center justify-between pt-4">
          <Badge icon={<UsersIcon className="size-3" />}>
            {team.memberCount} members
          </Badge>
          <div className="flex group-hover:bg-primary/80 absolute bottom-6 right-6 bg-primary p-2 items-center rounded-full group-hover:translate-x-1  transition-all">
            <ArrowRight className="size-5 text-foreground dark:text-card" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
