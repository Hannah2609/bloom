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
        <section className="bg-background h-full border md:my-3 md:mr-3 md:ml-1 md:rounded-lg dark:border-0">
          <Header />
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
