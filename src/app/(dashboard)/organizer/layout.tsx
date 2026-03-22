import { AppSidebar } from "@/components/features/dashboard/shared/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  //   // Redirect Logic if user is banned
  //   if (user.isBlocked) {
  //     redirect("/blocked");
  //   }

  //   // Redirect if email is not verified
  //   if (!user.emailVerified) {
  //     redirect("/verify-email");
  //   }

  return (
    <SidebarProvider>
      <AppSidebar
        role={user.role}
        user={{ name: user.name, email: user.email, avatar: user.image || "" }}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-8 max-w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
