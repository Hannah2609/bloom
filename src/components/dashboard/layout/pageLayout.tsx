import React from "react";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4 py-10 md:px-6 md:py-10 peer-data-[state=expanded]:md:pl-12 space-y-2 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">{children}</div>
    </section>
  );
}
