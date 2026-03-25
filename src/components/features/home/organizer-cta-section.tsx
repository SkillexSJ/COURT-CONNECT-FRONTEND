"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { userService } from "@/service/user.service";
import { toast } from "sonner";

export function OrganizerCtaSection() {
  const router = useRouter();
  // SESSION & USER PROFILE
  const { data: session, isPending } = authClient.useSession();

  // QUERIES
  const userProfileQuery = useQuery({
    queryKey: ["cta-user-profile"],
    queryFn: () => userService.getProfile(),
    enabled: Boolean(session?.session?.id),
    staleTime: 30_000,
  });

  // HANDLERS
  const handleGetStarted = () => {
    if (isPending || userProfileQuery.isLoading) return;

    const role = userProfileQuery.data?.data?.role;

    if (!role) {
      router.push("/signin?callbackUrl=/dashboard/become-organizer");
      return;
    }

    if (role === "ORGANIZER") {
      router.push("/organizer");
      toast.success(
        "Welcome back, Organizer! Manage your courts and bookings here.",
      );
      return;
    }

    if (role === "ADMIN") {
      router.push("/admin");
      return;
    }

    router.push("/dashboard/become-organizer");
  };

  return (
    <section className="bg-surface my-24 px-6 py-32 text-center md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-primary md:text-8xl">
          List Your Venue.
          <br />
          <span className="bg-secondary px-3 py-1">Scale Your Impact.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
          Join a premium network of sports facilities and manage bookings,
          analytics, and member growth from one platform.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 md:flex-row">
          <button
            type="button"
            onClick={handleGetStarted}
            className="bg-primary w-1/2 mx-auto px-10 py-5 font-display text-sm hover:bg-secondary hover:text-black font-black uppercase tracking-widest text-secondary cursor-pointer"
          >
            Get Started Today
          </button>
          {/* <button className="border-2 border-primary px-10 py-5 font-display text-sm font-black uppercase tracking-widest text-primary transition hover:bg-primary hover:text-surface">
            Partner Portal
          </button> */}
        </div>
      </div>
    </section>
  );
}
