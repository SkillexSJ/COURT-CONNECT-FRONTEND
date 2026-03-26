export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // route protection for user
  if (user.role !== "USER") {
    if (user.role === "ADMIN") redirect("/admin");
    if (user.role === "ORGANIZER") redirect("/organizer");
  }

  return <>{children}</>;
}
