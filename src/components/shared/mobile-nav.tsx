"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, MenuIcon, User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/**
 * SESSION TYPE
 */
import type { Session } from "@/lib/session";

type NavLink = {
  label: string;
  href: string;
};

interface MobileNavProps {
  session?: Session | null;
  isPending?: boolean;
  navLinks?: NavLink[];
  onSignOut?: () => Promise<void>;
}

const fallbackNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Organizers", href: "/organizers" },
  { label: "Venues", href: "/venues" },
];

export function MobileNav({
  session,
  isPending,
  navLinks,
  onSignOut,
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData, isPending: isPendingHook } =
    authClient.useSession();
  const [open, setOpen] = useState(false);

  const resolvedSession = session ?? sessionData ?? null;
  const resolvedPending =
    typeof isPending === "boolean" ? isPending : isPendingHook;
  const resolvedNavLinks = navLinks ?? fallbackNavLinks;
  const avatarSrc = resolvedSession
    ? resolvedSession.user.image ||
      ((resolvedSession.user as { avatarUrl?: string | null }).avatarUrl ?? "")
    : "";

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
      setOpen(false);
      return;
    }

    await authClient.signOut();
    toast.success("Signed out successfully!");
    router.refresh();
    setOpen(false);
  };

  // for logical routing
  const profileHref =
    (resolvedSession as Session | null)?.user.role === "ADMIN"
      ? "/admin/profile"
      : (resolvedSession as Session | null)?.user.role === "ORGANIZER"
        ? "/organizer/settings"
        : "/dashboard/profile";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 lg:hidden">
        {resolvedSession ? (
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={avatarSrc}
              alt={resolvedSession.user.name || "User"}
            />
            <AvatarFallback className="bg-accent text-foreground">
              {resolvedSession.user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        ) : null}

        <SheetTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open menu"
            className="h-9 w-9 touch-manipulation"
            onTouchStart={() => setOpen(true)}
          >
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
      </div>

      <SheetContent
        side="left"
        className="w-[86vw] max-w-sm overflow-y-auto border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground sm:w-90"
      >
        <SheetHeader className="border-b border-sidebar-border px-6 py-5 text-left">
          <SheetTitle className="text-base font-semibold uppercase tracking-wide text-sidebar-foreground">
            Navigation
          </SheetTitle>
          <p className="text-xs text-sidebar-foreground/70">
            Discover venues and manage your Court Connect profile.
          </p>
        </SheetHeader>

        <div className="space-y-4 px-6 pb-6 pt-4">
          {resolvedSession ? (
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {resolvedSession.user.name}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {resolvedSession.user.email}
              </p>
            </div>
          ) : null}

          <div className="grid gap-2">
            {resolvedNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-11 w-full justify-start rounded-lg text-sm text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === link.href
                    ? "bg-secondary text-primary hover:bg-secondary/90 hover:text-primary"
                    : "",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Separator className="border bg-sidebar-border" />

          {resolvedPending ? (
            <div className="flex flex-col gap-3">
              <div className="h-10 w-full animate-pulse rounded-lg bg-sidebar-accent" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-sidebar-accent" />
            </div>
          ) : resolvedSession ? (
            <div className="grid gap-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-1/2 justify-start rounded-lg border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                )}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href={profileHref}
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-1/2 justify-start rounded-lg border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                )}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  buttonVariants({ variant: "destructive" }),
                  "h-11 w-full justify-start  rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground",
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid gap-2">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-full justify-start rounded-lg border-sidebar-border bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                )}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants(),
                  "h-11 w-full justify-start rounded-lg bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                )}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
