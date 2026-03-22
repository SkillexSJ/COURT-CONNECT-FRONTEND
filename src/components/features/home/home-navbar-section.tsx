import { Search, User } from "lucide-react";

import { navLinks } from "./data";

export function HomeNavbarSection() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-5 md:px-12">
        <div className="font-display text-2xl font-black uppercase tracking-tight text-primary">
          The Athletic
        </div>

        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="font-display text-xs font-bold uppercase tracking-widest text-primary/70 transition-opacity hover:text-primary"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-4 text-primary sm:flex">
            <Search className="h-5 w-5" />
            <User className="h-5 w-5" />
          </div>
          <button className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest">
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
}
