"use client";

import Image from "next/image";
import Link from "next/link";

type AuthSplitLayoutProps = {
  children: React.ReactNode;
};

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col bg-background md:h-screen md:flex-row md:overflow-hidden">
      <section className="relative flex w-full min-h-115 flex-col justify-between overflow-hidden bg-primary p-6 md:h-full md:w-1/2 md:p-12 lg:p-16">
        <div className="absolute inset-0 z-0">
          <Image
            className="object-cover opacity-65"
            alt="Elite arena athlete"
            src="/image3.png"
            fill
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary/75 via-primary/55 to-primary/45" />
        </div>

        <div className="relative z-10 flex h-full min-h-full flex-col justify-between">
          <div className="flex items-center ">
            <Link
              href={"/"}
              className="font-heading text-2xl text-white font-black tracking-tighter mb-10 uppercase md:text-3xl lg:text-[2rem]"
            >
              <span className="text-secondary">COURT</span> CONNECT
            </Link>
          </div>

          <div className="mt-auto space-y-6 md:mb-16 md:space-y-8">
            <div>
              <h1 className="mb-6 font-heading text-4xl font-black tracking-tighter text-primary-foreground uppercase leading-[0.95] md:text-5xl lg:text-6xl xl:text-[5.5rem]">
                BEYOND THE <br />
                <span className="text-secondary">LIMITS.</span>
              </h1>
              <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-primary-foreground/90 md:text-lg lg:text-xl">
                Join the most exclusive network of high-performance athletes and
                professional venue organizers.
              </p>
            </div>

            <div className="mt-12 flex w-full gap-10 pt-8 md:gap-16">
              <div>
                <div className="font-heading text-3xl font-black leading-none text-secondary md:text-[2.5rem]">
                  2.4k+
                </div>
                <div className="mt-2 font-sans text-[10px] tracking-[0.15em] text-primary-foreground/70 uppercase sm:text-xs">
                  Active Venues
                </div>
              </div>
              <div>
                <div className="font-heading text-3xl font-black leading-none text-secondary md:text-[2.5rem]">
                  150k+
                </div>
                <div className="mt-2 font-sans text-[10px] tracking-[0.15em] text-primary-foreground/70 uppercase sm:text-xs">
                  Users
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-background p-6 sm:p-8 md:h-full md:w-1/2 md:overflow-y-auto md:p-12 lg:p-16">
        <div className="flex min-h-full flex-col">
          <div className="flex w-full flex-1 items-center justify-center">
            <div className="w-full max-w-105">{children}</div>
          </div>

          <div className="mx-auto mt-12 flex w-full max-w-105 items-center justify-between pt-8 font-bold tracking-widest text-[10px] text-muted-foreground uppercase sm:text-xs md:max-w-none">
            <div>© 2026 COURT CONNECT</div>
            <div className="flex gap-4">
              <a href="#" className="transition-colors hover:text-primary">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                Terms
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
