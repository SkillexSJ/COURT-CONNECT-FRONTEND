"use client";

/**
 * NODE PACKAGES
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, LogOut } from "lucide-react";
/**
 * HOOKS
 */

/**
 * COMPONENTS
 */
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { buttonVariants } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/**
 * LIBS
 */
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import type { Session } from "@/lib/session";
import { useScroll } from "@/hooks/use-scroll";
export const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Organizers",
    href: "/organizers",
  },
  {
    label: "Venues",
    href: "/venues",
  },
];

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const scrolled = useScroll(10);
  const pathname = usePathname();
  const { data: rawSession, isPending } = authClient.useSession();
  const session = rawSession as Session | null;
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully!");
    router.refresh();
  };

  // for logical routing
  const profileHref =
    session?.user.role === "ADMIN"
      ? "/admin/profile"
      : session?.user.role === "ORGANIZER"
        ? "/organizer/settings"
        : "/dashboard/profile";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 mx-auto w-[calc(100%-1rem)] max-w-7xl border border-border/70 bg-background/90 backdrop-blur-xl shadow-sm transition-all duration-300 md:top-3 md:rounded-xl",
        {
          "md:max-w-6xl border-border bg-background/95 shadow-md": scrolled,
        },
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-3 sm:px-4 lg:h-16 lg:px-6",
          {
            "lg:px-5": scrolled,
          },
        )}
      >
        <div className="flex items-center gap-5">
          <Logo />
          <div className="hidden xl:block h-7 w-px bg-border" />
          <p className="hidden xl:block text-xs uppercase tracking-widest text-muted-foreground">
            Premium Court Booking
          </p>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-md px-4 text-sm font-medium",
                pathname === link.href
                  ? "bg-secondary text-primary hover:bg-secondary/90 hover:text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/70",
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}

          {isPending ? (
            <div className="flex gap-2">
              <div className="hidden md:block h-9 w-24 animate-pulse bg-muted rounded-md" />
              <div className="h-8 w-8 animate-pulse bg-muted rounded-full border border-border" />
            </div>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border border-border hover:border-primary transition-colors">
                  <AvatarImage
                    src={session.user.avatarUrl || session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-accent text-foreground">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-xl border-border/70 bg-background/95 shadow-lg"
              >
                <div className="flex items-center gap-3 p-2 mb-1 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={session.user.avatarUrl || session.user.image || ""}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-accent text-foreground animate-pulse">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/80">
                      {session.user.role}
                    </p>
                  </div>
                </div>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  asChild
                  className="rounded-lg focus:bg-accent focus:text-foreground cursor-pointer"
                >
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="rounded-lg focus:bg-accent focus:text-foreground cursor-pointer"
                >
                  <Link
                    href={profileHref}
                    className="w-full flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer flex items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-md border-border",
                )}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants(),
                  "rounded-md bg-secondary text-secondary-foreground hover:opacity-90",
                )}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
        <MobileNav
          session={session}
          isPending={isPending}
          navLinks={navLinks}
          onSignOut={handleSignOut}
        />
      </nav>
    </header>
  );
}
