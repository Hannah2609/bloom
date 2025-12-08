"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label="Toggle theme"
      thumbContent={
        isDark ? (
          <Moon className="text-primary h-3 w-3" />
        ) : (
          <Sun className="text-secondary-500 h-3 w-3" />
        )
      }
    />
  );
}
