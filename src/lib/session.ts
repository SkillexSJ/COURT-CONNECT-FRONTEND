import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ORGANIZER" | "ADMIN";
  phone?: string | null;
  avatarUrl?: string | null;
  image?: string | null;
  isApproved?: boolean;
  stripeCustomerId?: string | null;
  isBlocked?: boolean;
  emailVerified: boolean;
}

export interface Session {
  user: User;
  session: {
    id: string;
    expiresAt: string;
  };
}

export async function getSession(): Promise<Session | null> {
  try {
    const { data } = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });

    if (!data) {
      return null;
    }

    return data as unknown as Session;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}
