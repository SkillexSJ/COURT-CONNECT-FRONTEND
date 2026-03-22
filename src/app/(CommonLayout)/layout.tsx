import type { ReactNode } from "react";

import { Header } from "@/components/shared/header";
import type { Session } from "@/lib/session";

const dummySession: Session = {
  user: {
    id: "demo-user-1",
    email: "demo.user@courtconnect.dev",
    name: "Demo User",
    image: "https://i.pravatar.cc/120?img=12",
    role: "student",
    emailVerified: true,
    isBlocked: false,
  },
  session: {
    id: "demo-session-1",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  },
};

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header initialSession={dummySession} />
      <main className="flex-1">{children}</main>
      {/* <Footer />  */}
    </div>
  );
}
