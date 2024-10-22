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
        icon: "calendar1",
      },
      {
        title: "Team Schedule",
        href: "/dashboard/team-schedule",
        icon: "calendar",
      },
     
    ],
    roleSpecific: {
      1: [
        {
          title: "Overall Schedule",
          href: "/dashboard/overall-schedule",
          icon: "calendarDays",
        },
        {
          title: "Manage Employees",
          href: "/dashboard/manage-employees",
          icon: "users",
        },
      ],
      2: [],
      3: [
        {
          title: "Manage Employees",
          href: "/dashboard/manage-employees",
          icon: "users",
        },
      ],
    },
  },
};
