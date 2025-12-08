"use client";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdownMenu";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { isActive } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center md:px-8 px-4 py-4 fixed top-0 left-0 right-0 z-50 bg-transparent">
      <Link href="/">
        <h2 className="text-2xl font-bold">Bloom</h2>
      </Link>
      <div className="flex items-center p-2 md:gap-2 rounded-full bg-background">
        <Link
          href="/"
          data-active={isActive(pathname, "/")}
          className="text-sm text-muted-foreground px-4 py-2 hover:bg-muted hover:text-foreground rounded-full data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
        >
          Home
        </Link>
        <Link
          href="/login"
          data-active={isActive(pathname, "/login")}
          className="text-sm text-muted-foreground px-4 py-2 hover:bg-muted hover:text-foreground rounded-full data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
        >
          Login
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            data-active={
              isActive(pathname, "/signup") ||
              isActive(pathname, "/signup-company")
            }
            className="text-sm text-muted-foreground hover:text-foreground cursor-pointer active:bg-muted focus:outline-none px-4 py-2 flex items-center gap-2 hover:bg-muted rounded-full data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          >
            Signup
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link
                href="/signup"
                data-active={isActive(pathname, "/signup")}
                className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              >
                Employee
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/signup-company"
                data-active={isActive(pathname, "/signup-company")}
                className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              >
                Company
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
