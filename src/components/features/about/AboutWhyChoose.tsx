/* eslint-disable react/no-unescaped-entities */
import { MapPin, Users, Zap, Globe, Award, TrendingUp } from "lucide-react";

const whyChoose = [
  {
    icon: MapPin,
    title: "Smart Venue Discovery",
    description:
      "AI-powered recommendations match your skill level with the perfect venue, every time.",
  },
  {
    icon: Users,
    title: "Verified Organizers",
    description:
      "Every venue is professionally managed and verified for quality, safety, and maintenance standards.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description:
      "Real-time slot availability and instant confirmations. No more back-and-forth calls.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Access 1000+ premium venues across 12+ countries from one unified platform.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description:
      "Industry-standard venues with professional-grade infrastructure and amenities.",
  },
  {
    icon: TrendingUp,
    title: "Community Growth",
    description:
      "Connect with players, showcase your skills, and build your sports network organically.",
  },
];

export function AboutWhyChoose() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-360 mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black text-primary uppercase tracking-[0.18em] mb-4">
            Why Court Connect ?
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-primary">
            Everything Athletes
            <br />
            <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
              Need
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From discovery to booking to playing, we've optimized every step of
            the experience.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChoose.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 bg-surface hover:bg-primary cursor-default overflow-hidden transition-colors duration-300"
              >
                {/* Large background icon */}
                <div className="absolute -top-12 -right-12 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <Icon className="h-48 w-48 text-primary group-hover:text-primary-foreground" />
                </div>

                {/* Top-left accent corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary group-hover:border-secondary" />
                {/* Bottom-right accent corners */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary group-hover:border-secondary" />

                {/* Numbered badge */}
                <div className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center border-2 border-primary/20 bg-primary/5 group-hover:border-primary-foreground/30 group-hover:bg-primary-foreground/10">
                  <span className="font-display text-sm font-black text-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon line accent */}
                  <div className="h-0.75 w-6 bg-secondary group-hover:bg-secondary mb-6" />

                  {/* Title */}
                  <h3 className="font-heading font-bold text-primary group-hover:text-primary-foreground uppercase text-sm tracking-wide mb-3 leading-tight transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-foreground/70 group-hover:text-primary-foreground/80 leading-relaxed transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
