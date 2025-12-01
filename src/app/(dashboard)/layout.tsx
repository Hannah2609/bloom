"use client";

import { LoadingSpinner } from "@/components/ui/loading/loadingSpinner";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/AppSidebar";
import Header from "@/components/nav/Header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useProtectedRoute();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <section className="my-3 mr-3 rounded-lg bg-background h-full border border-border">
          <Header />
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
