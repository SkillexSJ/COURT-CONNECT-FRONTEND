import { type Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: readonly {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="px-2">
      <SidebarGroupContent className="flex flex-col gap-1.5">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-11 rounded-md text-[13px] font-medium tracking-tight text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    isActive &&
                      "bg-secondary text-secondary-foreground hover:bg-secondary/95 hover:text-secondary-foreground",
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="size-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
