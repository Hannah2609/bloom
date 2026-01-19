"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch/switch";
import { useSyncExternalStore } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Switch
        checked={false}
        onCheckedChange={() => {}}
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label="Toggle theme"
      thumbContent={
        isDark ? (
          <Moon className="text-primary h-4 w-4" />
        ) : (
          <Sun className="text-secondary-500 h-4 w-4" />
        )
      }
    />
  );
}
