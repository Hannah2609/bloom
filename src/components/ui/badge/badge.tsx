import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, icon, className }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(
        "bg-primary-100 dark:bg-background text-muted-foreground dark:text-primary flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium",
        className
      )}
    >
      {icon && <div data-slot="badge-icon">{icon}</div>}
      {children}
    </div>
  );
}
