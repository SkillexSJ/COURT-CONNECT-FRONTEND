import type { ReactNode } from "react";

import { Header } from "@/components/shared/header";
import { getSession } from "@/lib/session";

export default async function CommonLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Header initialSession={session} />
      <main className="flex-1">{children}</main>
      {/* <Footer />  */}
    </div>
  );
}
