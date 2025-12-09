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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar/avatar";
import { useSession } from "@/hooks/useSession";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { isActive } from "@/lib/utils";

export function AppSidebar() {
  const { user } = useSession();
  const { logout } = useAuth();
  const pathname = usePathname();

  // menu (items) data
  const items = [
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
    {
      title: "Teams",
      url: "/teams",
      icon: Users,
    },
  ];

  const adminItems = [
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

  // Combine items based on user role
  const menuItems =
    user?.role === Role.ADMIN ? [...items, ...adminItems] : items;

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
                {user?.company.logo ? (
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

      <SidebarContent className="flex items-center justify-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
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
                        <item.icon className="group-data-[active=true]:text-primary-foreground dark:group-data-[active=true]:text-foreground text-muted-foreground" />
                        <span className="pl-1 text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
