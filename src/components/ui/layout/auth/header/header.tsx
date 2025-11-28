import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4">
      <Link href="/">
        <h2 className="text-2xl font-bold">Bloom</h2>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm text-muted-foreground">
          Login
        </Link>
        <Link href="/signup" className="text-sm text-muted-foreground">
          Sign up
        </Link>
        <Link href="/signup-company" className="text-sm text-muted-foreground">
          For companies
        </Link>
      </div>
    </header>
  );
}
