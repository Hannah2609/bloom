import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdownMenu";
import {
  ChevronsUpDown,
  House,
  LogOut,
  UserRound,
  MessageCircleHeart,
  Settings,
  LucideEdit,
} from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar/avatar";
import { useSession } from "@/hooks/useSession";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function AppSidebar() {
  const { user } = useSession();
  const { logout } = useAuth();

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
                <AvatarImage
                  src={user?.company?.logo || "https://github.com/shadcn.png"}
                  alt={user?.company?.name || "Company Logo"}
                />
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
            <SidebarMenu className="space-y-6">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-5!" />
                      <span className="pl-1 text-base font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === "ADMIN" &&
                adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="size-5!" />
                        <span className="pl-1 text-base font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                  </Avatar>
                  <span className="truncate pl-2 font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronsUpDown className="ml-auto" />
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
