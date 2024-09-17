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
  loggedOutNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Login",
      href: "/login",
    },
  ],
  loggedInNav: [
    {
      title: "Home",
      href: "/dashboard",
    },
    {
      title: "My Schedule",
      href: "/schedule",
    },
    {
      title: "Apply for WFH",
      href: "/apply",
    },
    {
      title: "Manage Arrangements",
      href: "/manage",
    },
    {
      title: "Logout",
      href: "/logout",
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
