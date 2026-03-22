import {
  IconDashboard,
  IconUsers,
  IconCalendarEvent,
  IconChartBar,
  IconUserCircle,
  IconSearch,
  IconCategory,
  IconClock,
  IconSettings,
} from "@tabler/icons-react";

export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

export const dashboardConfig = {
  USER: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Explore Courts",
        url: "/venues",
        icon: IconSearch,
      },
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
        icon: IconCalendarEvent,
      },
      {
        title: "My Profile",
        url: "/dashboard/profile",
        icon: IconUserCircle,
      },
    ],
  },
  ORGANIZER: {
    navMain: [
      {
        title: "Dashboard",
        url: "/organizer",
        icon: IconDashboard,
      },
      {
        title: "Bookings",
        url: "/organizer/bookings",
        icon: IconCalendarEvent,
      },
      {
        title: "Analytics",
        url: "/organizer/analytics",
        icon: IconChartBar,
      },
      {
        title: "Venue Management",
        url: "/organizer/venues",
        icon: IconCategory,
      },
      {
        title: "Settings",
        url: "/organizer/settings",
        icon: IconSettings,
      },
    ],
  },
  ADMIN: {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: IconDashboard,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: IconUsers,
      },
      {
        title: "Organizers",
        url: "/admin/organizers",
        icon: IconCategory,
      },
      {
        title: "Bookings",
        url: "/admin/bookings",
        icon: IconCalendarEvent,
      },
      {
        title: "Reports",
        url: "/admin/reports",
        icon: IconChartBar,
      },
      {
        title: "Profile",
        url: "/admin/profile",
        icon: IconUserCircle,
      },
    ],
  },
} as const;
