import React from "react";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-6 py-10 md:px-6 md:py-10 space-y-2">
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}