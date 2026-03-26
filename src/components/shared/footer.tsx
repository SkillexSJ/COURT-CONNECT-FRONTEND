import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const navigationLinks = [
  "Find a Venue",
  "Member Perks",
  "The Journal",
  "Athletic Labs",
];

const supportLinks = [
  "Global Concierge",
  "Booking FAQ",
  "Safety Protocols",
  "Account Access",
];

const communityLinks = [
  "Athlete Forum",
  "Partner with Us",
  "Founders Circle",
  "Press Inquiries",
];

const socialLinks = ["IG", "TW", "LI", "YT"];

export function Footer() {
  return (
    <footer className=" w-full md:max-w-7xl md:mb-10 md:rounded-4xl md:mx-auto border-t border-sidebar-border/70 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto w-full max-w-350 px-6 pb-8 pt-14 sm:px-8 lg:px-12 lg:pt-18">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="space-y-5">
            <h2 className="inline-block font-heading text-5xl font-black uppercase leading-[0.84] tracking-[-0.03em] text-sidebar-primary sm:text-8xl">
              <span className="block">
                <span>C</span>
                <span className="relative mx-[0.02em] inline-block h-[0.78em] w-[0.78em] translate-y-[0.15em]">
                  <Image
                    src="/logo.svg"
                    alt="Court Connect Logo"
                    fill
                    loading="eager"
                    className="object-contain scale-220"
                    sizes="(max-width: 640px) 40px, 80px"
                  />
                </span>
                <span>URT</span>
              </span>
              <span className="block">Connect</span>
            </h2>

            <div className="md:inline-flex items-center gap-2 border border-sidebar-border bg-sidebar-accent/60 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-primary">
                Member of the SKILLEX Network
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <p className="max-w-md text-xs font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/85 sm:text-sm">
              Subscribe to the journal for elite scouting reports and private
              venue drops.
            </p>

            <form className="space-y-3">
              <div className="flex items-end gap-2 border-b border-sidebar-border pb-2">
                <input
                  type="email"
                  placeholder="YOUR@EMAIL.COM"
                  className="h-11 w-full bg-transparent font-heading text-2xl font-black uppercase tracking-tight text-sidebar-foreground outline-none placeholder:text-sidebar-foreground/30 sm:text-4xl"
                />
                <button
                  type="submit"
                  className="mb-1 inline-flex size-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground transition-transform hover:scale-105"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-sidebar-foreground/60">
                No spam. Premium venue insights only.
              </p>
            </form>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-sidebar-border/70" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Navigation" items={navigationLinks} />
          <FooterColumn title="Support" items={supportLinks} />
          <FooterColumn title="Community" items={communityLinks} />

          <div className="space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-primary">
              Social Connection
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <Link
                  key={item}
                  href="/"
                  className="inline-flex h-10 min-w-10 items-center justify-center border border-sidebar-border bg-sidebar-accent/60 px-3 text-xs font-bold uppercase tracking-[0.12em] text-sidebar-foreground transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-sidebar-border/70" />

        <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Court Connect Network. Built for players.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-sidebar-primary">
              Privacy Charter
            </Link>
            <Link href="/" className="hover:text-sidebar-primary">
              Terms of Presence
            </Link>
            <Link href="/" className="hover:text-sidebar-primary">
              Cookie Integrity
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-primary">
        {title}
      </p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground transition-colors hover:text-sidebar-primary"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
