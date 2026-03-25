import {
  IconDashboard,
  IconUsers,
  IconCalendarEvent,
  IconChartBar,
  IconUserCircle,
  IconSearch,
  IconCategory,
  IconSettings,
  IconTicket,
  IconSpeakerphone,
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
        title: "Venues",
        url: "/organizer/venues",
        icon: IconCategory,
        items: [
          {
            title: "All Venues",
            url: "/organizer/venues",
          },
          {
            title: "Add Venue",
            url: "/organizer/venues/new",
          },
          {
            title: "Schedules",
            url: "/organizer/venues/schedules",
          },
        ],
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
        title: "Announcements",
        url: "/organizer/announcements",
        icon: IconSpeakerphone,
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
        title: "Coupons",
        url: "/admin/coupons",
        icon: IconTicket,
      },
      {
        title: "Announcements",
        url: "/admin/announcements",
        icon: IconSpeakerphone,
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
