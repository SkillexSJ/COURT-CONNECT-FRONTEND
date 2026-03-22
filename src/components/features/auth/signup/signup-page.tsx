"use client";

import { SignUpForm } from "./signup-form";
import Image from "next/image";

export function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left Side: Editorial Content */}
      <section className="relative w-full md:w-1/2 min-h-115 md:min-h-screen bg-primary overflow-hidden flex flex-col justify-between p-6 md:p-12 lg:p-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            className="object-cover opacity-50 mix-blend-multiply"
            alt="Elite arena athlete"
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=1600&fit=crop"
            fill
            priority
          />
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-primary/60"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full min-h-full">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-secondary font-heading font-black text-2xl md:text-3xl lg:text-[2rem] tracking-tighter uppercase">
              ELITE ARENA
            </span>
          </div>

          {/* Main Content */}
          <div className="space-y-6 md:space-y-8 mt-auto md:mb-16">
            {/* Headline */}
            <div>
              <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] tracking-tighter text-primary-foreground leading-[0.95] mb-6 uppercase">
                BEYOND THE <br />
                <span className="text-secondary">LIMITS.</span>
              </h1>
              <p className="text-primary-foreground/90 font-sans text-base md:text-lg lg:text-xl leading-relaxed max-w-md mt-6">
                Join the most exclusive network of high-performance athletes and
                professional venue organizers.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-10 md:gap-16 pt-8 mt-12 w-full">
              <div>
                <div className="font-heading font-black text-3xl md:text-[2.5rem] leading-none text-secondary">
                  2.4k+
                </div>
                <div className="font-sans text-[10px] sm:text-xs tracking-[0.15em] text-primary-foreground/70 uppercase mt-2">
                  Active Venues
                </div>
              </div>
              <div>
                <div className="font-heading font-black text-3xl md:text-[2.5rem] leading-none text-secondary">
                  150+
                </div>
                <div className="font-sans text-[10px] sm:text-xs tracking-[0.15em] text-primary-foreground/70 uppercase mt-2">
                  Pro Trainers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Registration Form */}
      <section className="relative w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:p-16 bg-background min-h-150 md:min-h-screen">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-105">
            <SignUpForm />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 w-full max-w-105 mx-auto md:max-w-none flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase mt-12">
          <div>© 2024 ELITE ARENA</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUpPage;
