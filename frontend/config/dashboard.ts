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
  ],
  loggedInNav: [],
  sidebarNav: {
    common: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: "home",
      },
      {
        title: "Apply for WFH",
        href: "/dashboard/apply",
        icon: "filePlus",
      },
      {
        title: "Manage Arrangements",
        href: "/dashboard/manage",
        icon: "settings",
      },
      {
        title: "My Schedule",
        href: "/dashboard/my-schedule",
        icon: "calendar",
      },
      {
        title: "Team Schedule",
        href: "/dashboard/team-schedule",
        icon: "users",
      },
    ],
    roleSpecific: {
      1: [
        {
          title: "View Overall Schedule",
          href: "/overall-schedule",
          icon: "calendar",
        },
      ],
      2: [],
    },
  },
};
