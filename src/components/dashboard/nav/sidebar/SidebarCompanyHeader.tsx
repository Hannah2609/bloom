import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarCompanyHeaderProps {
  companyName?: string;
  companyLogo?: string | null;
}

export function SidebarCompanyHeader({
  companyName,
  companyLogo,
}: SidebarCompanyHeaderProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-transparent disabled:pointer-events-none disabled:opacity-100"
          disabled
        >
          <Avatar className="h-8 w-8">
            {companyLogo ? (
              <AvatarImage src={companyLogo} alt={companyName} />
            ) : (
              <AvatarFallback company />
            )}
          </Avatar>
          <span className="truncate pl-2 text-base font-semibold">
            {companyName}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}