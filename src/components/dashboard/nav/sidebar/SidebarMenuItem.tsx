import Link from "next/link";
import {
  SidebarMenuItem as SidebarMenuItemBase,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { type MenuItem, ICON_ACTIVE_CLASSES } from "./constants";

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
}

export function SidebarMenuItem({ item, isActive }: SidebarMenuItemProps) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItemBase>
      <SidebarMenuButton
        size="sm"
        asChild
        isActive={isActive}
        className="group"
      >
        <Link href={item.url} onClick={handleClick}>
          <item.icon className={ICON_ACTIVE_CLASSES} />
          <span className="pl-1 text-base">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemBase>
  );
}
