import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { Role } from "@/types/user";
import { isActive } from "@/lib/utils";
import { SidebarCompanyHeader } from "./SidebarCompanyHeader";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarTeamsMenu } from "./SidebarTeamsMenu";
import { SidebarUserFooter } from "./SidebarUserFooter";
import { MENU_ITEMS, ADMIN_ITEMS } from "./constants";

export function AppSidebar() {
  const { user } = useSession();
  const { logout } = useAuth();
  const pathname = usePathname();

  // Combine items based on user role
  const menuItems =
    user?.role === ("ADMIN" as Role)
      ? [...MENU_ITEMS, ...ADMIN_ITEMS]
      : MENU_ITEMS;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarCompanyHeader
          companyName={user?.company?.name}
          companyLogo={user?.company?.logo}
        />
      </SidebarHeader>

      <SidebarContent className="flex items-center justify-center px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mb-2 space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  item={item}
                  isActive={item.url !== "#" && isActive(pathname, item.url)}
                />
              ))}
            </SidebarMenu>

            <SidebarTeamsMenu pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserFooter
          firstName={user?.firstName}
          lastName={user?.lastName}
          avatar={user?.avatar}
          onLogout={logout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
