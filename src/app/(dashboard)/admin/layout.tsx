export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    if (user.role === "ORGANIZER") redirect("/organizer");
    redirect("/dashboard");
  }

  return <>{children}</>;
}
