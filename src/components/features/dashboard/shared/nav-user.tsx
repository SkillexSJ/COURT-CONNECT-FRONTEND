"use client";

import { IconLogout, IconSettings } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.refresh();
  };

  return (
    <SidebarMenu className="px-2 pb-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md border border-sidebar-accent bg-sidebar px-2.5 py-2 text-left hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-8 w-8 rounded-md border border-sidebar-accent">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-md bg-sidebar-accent text-sidebar-foreground">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {user.name}
                </p>
                <p className="truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-md border border-sidebar-accent bg-sidebar shadow-lg"
          >
            <DropdownMenuItem className="flex items-center gap-2 rounded-sm px-2 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary cursor-pointer">
              <IconSettings className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-sm px-2 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary cursor-pointer"
            >
              <IconLogout className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
