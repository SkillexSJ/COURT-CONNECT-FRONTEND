"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/session";

type NavLink = {
  label: string;
  href: string;
};

interface MobileNavProps {
  session: Session | null;
  isPending: boolean;
  navLinks: NavLink[];
  onSignOut: () => Promise<void>;
}

export function MobileNav({
  session,
  isPending,
  navLinks,
  onSignOut,
}: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await onSignOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 lg:hidden">
        {session ? (
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={session.user.avatarUrl || session.user.image || ""}
              alt={session.user.name || "User"}
            />
            <AvatarFallback className="bg-accent text-foreground">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        ) : null}

        <SheetTrigger asChild>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </SheetTrigger>
      </div>

      <SheetContent
        side="right"
        className="w-[90vw] max-w-sm border-border bg-background p-0"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base uppercase tracking-wide">
            Navigation
          </SheetTitle>
          <SheetDescription>
            Discover venues and manage your Court Connect profile.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6 space-y-4">
          {session ? (
            <div className="rounded-lg border border-border bg-card px-3 py-2.5">
              <p className="text-sm font-semibold text-foreground truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          ) : null}

          <div className="grid gap-2">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-10 w-full justify-start rounded-lg",
                    pathname === link.href
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </div>

          <Separator />

          {isPending ? (
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          ) : session ? (
            <div className="grid gap-2">
              <SheetClose asChild>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 w-full justify-start rounded-lg border-border",
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/profile"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 w-full justify-start rounded-lg border-border",
                  )}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </SheetClose>

              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  buttonVariants({ variant: "destructive" }),
                  "h-10 w-full justify-start rounded-lg",
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid gap-2">
              <SheetClose asChild>
                <Link
                  href="/signin"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 w-full justify-start rounded-lg border-border",
                  )}
                >
                  Sign In
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants(),
                    "h-10 w-full justify-start rounded-lg bg-secondary text-secondary-foreground hover:opacity-90",
                  )}
                >
                  Get Started
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
