import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export function AboutEcosystem() {
  return (
    <section className="pt-14 max-w-7xl min-h-fit my-15 mx-auto sm:pt-16 lg:pt-12 pb-0 px-4 sm:px-6 lg:px-8 bg-primary  overflow-hidden">
      <div className="max-w-360 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-6 max-w-2xl">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white mb-4">
                Our Ecosystem
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[0.98]">
                SKILL
                <br className="hidden sm:block" /> BRIDGE
                <span className="text-secondary">.</span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-xl">
              <span className="font-black text-xl">SKILLBRIDGE</span> is a part
              of our company ecosystem where user can book tutor in various
              fields and gain knowledge.
            </p>

            <Link
              href="https://skill-bridge-frontend-kappa.vercel.app"
              className="text-secondary font-bold inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Visit SKILLBRIDGE
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right Visual */}
          <div className="relative h-90 sm:h-105 lg:h-130 overflow-visible">
            <div className="absolute left-1/2 bottom-12 -translate-x-1/2 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-secondary/35 blur-3xl" />
            <div className="absolute left-1/2 bottom-2 -translate-x-1/2 h-40 w-48 sm:h-52 sm:w-64 rounded-full bg-white/20 blur-2xl" />
            <Image
              src="/phone.svg"
              alt="Phone Screenshot"
              width={720}
              height={1280}
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 48vw, 40vw"
              className="absolute left-1/2 bottom-0 -translate-x-1/2 w-90 sm:w-95 lg:w-110 h-auto max-w-none z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
