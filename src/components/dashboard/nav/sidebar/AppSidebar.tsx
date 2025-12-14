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
import { useSession } from "@/hooks/useSession";
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
type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type CollapsibleMenuItem = MenuItem & {
  items?: {
    title: string;
    url: string;
  }[];
};

type Team = {
  id: string;
  name: string;
};

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

// Helper functions
const checkIsActive = (url: string, pathname: string): boolean => {
  return url !== "#" && isActive(pathname, url);
};

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

  // Build team items dynamically
  const teamItems: CollapsibleMenuItem[] = [
    {
      title: "Teams",
      url: "/teams",
      icon: Users,
      items: [
        {
          title: "All Teams",
          url: "/teams",
        },
        ...teams.map((team) => ({
          title: team.name,
          url: `/teams/${team.id}`,
        })),
      ],
    },
  ];

  // Combine items based on user role
  const menuItems =
    user?.role === Role.ADMIN ? [...MENU_ITEMS, ...ADMIN_ITEMS] : MENU_ITEMS;

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
                const active = checkIsActive(item.url, pathname);

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
              {teamItems.map((item) => {
                const itemActive = checkIsActive(item.url, pathname);
                const hasActiveSubItem = item.items?.some((subItem) =>
                  checkIsActive(subItem.url, pathname)
                );
                const shouldBeOpen = itemActive || hasActiveSubItem;

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={shouldBeOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          size="sm"
                          isActive={itemActive}
                          className="group cursor-pointer"
                          tooltip={item.title}
                        >
                          <item.icon className={ICON_ACTIVE_CLASSES} />
                          <span className="pl-1 text-base">{item.title}</span>
                          <ChevronRight className="text-muted-foreground ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const subItemActive = checkIsActive(
                              subItem.url,
                              pathname
                            );
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  size="sm"
                                  asChild
                                  isActive={subItemActive}
                                  className="group"
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
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
                <DropdownMenuItem>
                  <UserRound />
                  <span>Profile</span>
                </DropdownMenuItem>
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
