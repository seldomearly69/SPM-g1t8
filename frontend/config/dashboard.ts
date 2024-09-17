import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/dashboard",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "Team Schedule",
      href: "/dashboard/team-schedule",
      icon: "users",
    },
    {
      title: "My Schedule",
      href: "/dashboard/my-schedule",
      icon: "calendar",
    },
    {
      title: "Apply for WFH",
      href: "/dashboard/apply",
      icon: "file-plus",
    },
    {
      title: "Manage Arrangements",
      href: "/dashboard/manage",
      icon: "settings",
    },
  ],
};