import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuSubButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdownMenu";
import {
  EllipsisVertical,
  House,
  LogOut,
  UserRound,
  MessageCircleHeart,
  Settings,
  LucideEdit,
  Users,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar/avatar";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { isActive } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";

// Types
interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface Team {
  id: string;
  name: string;
}

// Constants
const ICON_ACTIVE_CLASSES =
  "group-data-[active=true]:text-primary-foreground dark:group-data-[active=true]:text-foreground text-muted-foreground";

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: House,
  },
  {
    title: "Survey",
    url: "/survey",
    icon: MessageCircleHeart,
  },
];

const ADMIN_ITEMS: MenuItem[] = [
  {
    title: "Manage users",
    url: "/admin",
    icon: Settings,
  },
  {
    title: "Create surveys",
    url: "#",
    icon: LucideEdit,
  },
];

export function AppSidebar() {
  const { user } = useSession();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [teams, setTeams] = useState<Team[]>([]);

  // Fetch teams for sidebar
  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  // Combine items based on user role
  const menuItems =
    user?.role === Role.ADMIN ? [...MENU_ITEMS, ...ADMIN_ITEMS] : MENU_ITEMS;

  // Teams menu state
  const teamsItemActive = isActive(pathname, "/teams");
  const hasActiveTeamSubItem = teams.some((team) =>
    isActive(pathname, `/teams/${team.id}`)
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent disabled:pointer-events-none disabled:opacity-100"
              disabled
            >
              <Avatar className="h-8 w-8">
                {user?.company?.logo ? (
                  <AvatarImage
                    src={user.company.logo}
                    alt={user.company.name}
                  />
                ) : (
                  <AvatarFallback company />
                )}
              </Avatar>
              <span className="truncate pl-2 text-base font-semibold">
                {user?.company?.name}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex items-center justify-center px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mb-2 space-y-2">
              {menuItems.map((item) => {
                const active = item.url !== "#" && isActive(pathname, item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      size="sm"
                      asChild
                      isActive={active}
                      className="group"
                    >
                      <Link href={item.url}>
                        <item.icon className={ICON_ACTIVE_CLASSES} />
                        <span className="pl-1 text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            <SidebarMenu>
              <Collapsible
                key="teams"
                asChild
                defaultOpen={hasActiveTeamSubItem}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <div className="relative">
                    {/* Clickable link covering most of button */}
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

                    {/* Chevron trigger - hidden when collapsed */}
                    <CollapsibleTrigger asChild>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-sm group-data-[collapsible=icon]:hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </button>
                    </CollapsibleTrigger>
                  </div>

                  {/* Sub-items hidden when sidebar is collapsed */}
                  <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSub>
                      {teams.map((team) => {
                        const subItemActive = isActive(
                          pathname,
                          `/teams/${team.id}`
                        );
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
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    {user?.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.firstName} />
                    ) : (
                      <AvatarFallback />
                    )}
                  </Avatar>
                  <span className="truncate pl-2 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <EllipsisVertical className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="mb-1 w-48">
                <Link href="/profile">
                  <DropdownMenuItem>
                    <UserRound />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
