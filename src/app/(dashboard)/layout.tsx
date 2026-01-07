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
        <section className="bg-background">
          <Header />
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
