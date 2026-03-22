"use client";

import * as React from "react";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { dashboardConfig, UserRole } from "../dashboard-config";

type LegacyUserRole = "user" | "organizer" | "admin";

const defaultUser = {
  name: "Marcus Chen",
  email: "premium.partner",
  avatar: "",
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: UserRole | LegacyUserRole;
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}

const normalizeRole = (role: UserRole | LegacyUserRole): UserRole => {
  if (role === "user") return "USER";
  if (role === "organizer") return "ORGANIZER";
  if (role === "admin") return "ADMIN";
  return role;
};

export function AppSidebar({
  role = "ORGANIZER",
  user = defaultUser,
  ...props
}: AppSidebarProps) {
  const config = dashboardConfig[normalizeRole(role)];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-4 pt-5 pb-4">
        <Link href="/" className="block rounded-md px-2 py-1.5">
          <p className="font-heading text-lg font-black tracking-tight text-primary uppercase">
            Elite Arena
          </p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Venue Manager
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-1 pb-3">
        <NavMain items={config.navMain} />
      </SidebarContent>

      <SidebarFooter className="gap-3 px-2 pb-4">
        <Link
          href="/organizer/bookings/new"
          className={cn(
            buttonVariants(),
            "h-11 w-full justify-center rounded-md bg-secondary text-secondary-foreground font-heading text-xs font-black uppercase tracking-[0.12em] hover:opacity-95",
          )}
        >
          <IconPlus className="mr-1.5 size-4" />
          New Booking
        </Link>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
