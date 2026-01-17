"use client";

import Header from "@/components/auth/header/header";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Force light mode on auth pages
    if (theme !== "light") {
      setTheme("light");
    }
    // Also remove dark class from html element to ensure it's not applied
    document.documentElement.classList.remove("dark");
  }, [setTheme, theme]);

  return (
    <>
      <Header />
      {children}
    </>
  );
}
