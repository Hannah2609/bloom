"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { Building2, UserRound } from "lucide-react";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full", className)}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends React.ComponentProps<
  typeof AvatarPrimitive.Fallback
> {
  company?: boolean;
}

function AvatarFallback({
  className,
  company = false,
  ...props
}: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "dark:bg-muted bg-base-400 flex size-full items-center justify-center rounded-full",
        company && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {company ? (
        <Building2 className="text-primary-foreground size-4" />
      ) : (
        <UserRound className="dark:text-primary text-base-100 size-4" />
      )}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
