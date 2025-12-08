import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <Link href="/">
        <h2 className="text-2xl font-bold">Bloom</h2>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-muted-foreground text-sm">
          Login
        </Link>
        <Link href="/signup" className="text-muted-foreground text-sm">
          Sign up
        </Link>
        <Link href="/signup-company" className="text-muted-foreground text-sm">
          For companies
        </Link>
      </div>
    </header>
  );
}
