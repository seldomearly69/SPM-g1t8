import { MainNav } from "@/components/main-nav";
import { DashboardNav } from "@/components/nav";
import { dashboardConfig } from "@/config/dashboard";
import Footer from "@/components/Footer";
import { UserAccountNav } from "@/components/user-account-nav";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import * as motion from "framer-motion/client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background w-full ">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex h-16 justify-between items-center pr-6 py-4"
        >
          <MainNav items={dashboardConfig.loggedInNav} />
          <UserAccountNav
            user={{
              email: user.email,
            }}
          />
        </motion.div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[300px_1fr]">
        <aside className="hidden w-[300px] flex-col md:flex">
          <DashboardNav
            sideBarNav={dashboardConfig.sidebarNav}
            currentUser={user}
          />
        </aside>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
