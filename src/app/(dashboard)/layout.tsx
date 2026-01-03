"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/nav/sidebar/AppSidebar";
import Header from "@/components/dashboard/nav/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <section className="bg-background h-screen md:h-[calc(100vh-1.5rem)] flex flex-col border md:my-3 md:mr-3 md:ml-1 md:rounded-lg dark:border-0">
          <Header />
          <section className="flex-1 overflow-y-auto">{children}</section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
