import { AppSidebar } from "@/components/features/dashboard/shared/AppSidebar";
import { DashboardWeatherChip } from "@/components/features/dashboard/shared/DashboardWeatherChip";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const roleLabel =
    user.role === "ADMIN"
      ? "Admin Console"
      : user.role === "ORGANIZER"
        ? "Organizer Console"
        : "User Dashboard";

  //   // Redirect Logic if user is banned
  //   if (user.isBlocked) {
  //     redirect("/blocked");
  //   }

  //   // Redirect if email is not verified
  //   if (!user.emailVerified) {
  //     redirect("/verify-email");
  //   }

  return (
    <SidebarProvider className="overflow-x-hidden">
      <AppSidebar
        role={user.role}
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl || user.image || "",
        }}
      />
      <SidebarInset className="min-w-0 overflow-x-clip">
        <div className="sticky top-0 z-20 border-b border-sidebar-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/75">
          <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="h-10 w-10 rounded-md border border-sidebar-border bg-sidebar/5 text-primary hover:bg-sidebar/10 md:h-11 md:w-11" />

              <div className="min-w-0">
                {/* <p className="truncate font-heading text-sm font-black uppercase tracking-[0.14em] text-primary sm:text-base">
                  COURT CONNECT
                </p> */}
                <p className="truncate text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <DashboardWeatherChip />
              {/* <div className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-sidebar-border bg-card px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[11px]">
                <RoleIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user.role}</span>
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6 overflow-x-clip p-4 md:p-8">
          <div className="mx-auto flex w-full min-w-0 max-w-400 flex-1 flex-col *:min-w-0">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
