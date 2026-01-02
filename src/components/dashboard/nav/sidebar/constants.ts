import { House, Settings, LucideEdit, ChartColumn } from "lucide-react";
import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const ICON_ACTIVE_CLASSES =
  "group-data-[active=true]:text-primary-foreground dark:group-data-[active=true]:text-foreground text-muted-foreground";

export const MENU_ITEMS: MenuItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: House,
  },
];

export const ADMIN_ITEMS: MenuItem[] = [
  {
    title: "Manage users",
    url: "/admin",
    icon: Settings,
  },
  {
    title: "Create surveys",
    url: "/create-surveys",
    icon: LucideEdit,
  },
  {
    title: "Survey analytics",
    url: "/survey-analytics",
    icon: ChartColumn,
  },
];
