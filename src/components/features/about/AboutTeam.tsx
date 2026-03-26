import Image from "next/image";
import Link from "next/link";
import { Share2, Link as LinkIcon } from "lucide-react";

const founder = {
  name: "Sajid Khan",
  role: "Founder & CEO",
  bio: "Former professional Progammer and Sport enthusiast. Built Court Connect to solve the venue discovery problem he faced as a player. With over 2 years in sports and technology development and a passion for technological innovation, Sajid leads the team in redefining how sports venues are discovered and utilized worldwide.",
  image: "/images/placeholders/skillex.jpg",
};

export function AboutTeam() {
  return (
    <section className="py-20 px-4 sm:py-28 sm:px-6 lg:px-8 mt-20 mb-15">
      <div className="max-w-360 mx-auto">
        {/* <div className="text-center mb-16">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary mb-4">
            The Creator
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-primary">
            Built by Athletes,
            <br />
            <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
              For Athletics
            </span>
          </h2>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Portrait */}
          <div className="relative w-full aspect-2/1 lg:aspect-square overflow-hidden bg-muted">
            <Image
              src={founder.image}
              alt={founder.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary mb-3">
                The Architect
              </p>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-primary">
                {founder.name}
              </h2>
              <h4 className="text-lg font-bold text-primary mt-3">
                {founder.role}
              </h4>
            </div>

            <p className="text-base leading-relaxed text-foreground/80">
              {founder.bio}
            </p>

            <div className="flex gap-6 pt-6">
              <button className="text-primary hover:text-secondary transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <Link
                href="#"
                className="text-primary hover:text-secondary transition-colors"
              >
                <LinkIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
