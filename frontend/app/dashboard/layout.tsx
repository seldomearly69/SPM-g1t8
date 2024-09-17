"use client";

import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { dashboardConfig } from "@/config/dashboard";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="w-full flex justify-between items-center">
          <MainNav items={dashboardConfig.loggedInNav} />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
