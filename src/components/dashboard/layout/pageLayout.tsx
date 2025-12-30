import React from "react";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-6 py-10 md:px-12 md:py-10 peer-data-[state=expanded]:md:pl-12 space-y-2">
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
