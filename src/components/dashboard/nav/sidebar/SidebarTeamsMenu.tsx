import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { isActive } from "@/lib/utils";
import { ICON_ACTIVE_CLASSES } from "./constants";

interface Team {
  id: string;
  name: string;
}

interface SidebarTeamsMenuProps {
  pathname: string;
}

export function SidebarTeamsMenu({ pathname }: SidebarTeamsMenuProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/teams")
      .then((res) => res.json())
      .then((data) => {
        if (data.teams) {
          setTeams(data.teams);
        }
      })
      .catch((error) => {
        console.error("Error fetching teams for sidebar:", error);
      });
  }, []);

  const teamsItemActive = isActive(pathname, "/teams");
  const hasActiveTeamSubItem = teams.some((team) =>
    isActive(pathname, `/teams/${team.id}`)
  );

  return (
    <SidebarMenu>
      <Collapsible
        asChild
        defaultOpen={hasActiveTeamSubItem}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <div className="relative">
            <SidebarMenuButton
              size="sm"
              asChild
              isActive={teamsItemActive}
              className="group"
            >
              <Link href="/teams" className="pr-8">
                <Users className={ICON_ACTIVE_CLASSES} />
                <span className="pl-1 text-base group-data-[collapsible=icon]:hidden">
                  Teams
                </span>
              </Link>
            </SidebarMenuButton>

            {/* Only show collapse toggle if there are teams */}
            {teams.length > 0 && (
              <CollapsibleTrigger asChild>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm group-data-[collapsible=icon]:hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </button>
              </CollapsibleTrigger>
            )}
          </div>

          {/* Only show submenu if there are teams */}
          {teams.length > 0 && (
            <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
              <SidebarMenuSub>
                {teams.map((team) => {
                  const subItemActive = isActive(pathname, `/teams/${team.id}`);
                  return (
                    <SidebarMenuSubItem key={team.id}>
                      <SidebarMenuSubButton
                        size="sm"
                        asChild
                        isActive={subItemActive}
                        className="group"
                      >
                        <Link href={`/teams/${team.id}`}>
                          <span>{team.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
