import Link from "next/link";
import { EllipsisVertical, LogOut, UserRound } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdownMenu";

interface SidebarUserFooterProps {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  onLogout: () => void;
}

export function SidebarUserFooter({
  firstName,
  lastName,
  avatar,
  onLogout,
}: SidebarUserFooterProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8">
                {avatar ? (
                  <AvatarImage src={avatar} alt={firstName} />
                ) : (
                  <AvatarFallback />
                )}
              </Avatar>
              <span className="truncate pl-2 font-medium">
                {firstName} {lastName}
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
            <DropdownMenuItem onClick={onLogout}>
              <LogOut />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
