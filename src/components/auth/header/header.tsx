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
import { Heading } from "@/components/ui/heading/heading";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between bg-transparent px-4 py-4 md:px-8">
      <Link href="/">
        <Heading level="h2" className="text-2xl! font-bold!">
          Bloom
        </Heading>
      </Link>
      <div className="bg-background flex items-center rounded-full p-2 md:gap-2">
        <Link
          href="/"
          data-active={isActive(pathname, "/")}
          className="text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground rounded-full px-4 py-2 text-sm"
        >
          Home
        </Link>
        <Link
          href="/login"
          data-active={isActive(pathname, "/login")}
          className="text-muted-foreground hover:bg-muted hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground rounded-full px-4 py-2 text-sm"
        >
          Login
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            data-active={
              isActive(pathname, "/signup") ||
              isActive(pathname, "/signup-company")
            }
            className="text-muted-foreground hover:text-foreground active:bg-muted hover:bg-muted data-[active=true]:bg-primary data-[active=true]:text-primary-foreground flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm focus:outline-none"
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
