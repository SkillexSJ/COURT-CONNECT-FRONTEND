/* eslint-disable react/no-unescaped-entities */
import { Target, Users, Zap } from "lucide-react";

export function AboutMissionVision() {
  return (
    <section className="py-20 sm:py-30 min-h-screen px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-360 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Mission */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary mb-3">
                Our Mission
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black uppercase tracking-tight text-primary-foreground leading-[1.1]">
                Make Elite Venues
                <br />
                <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
                  Accessible
                </span>
              </h2>
            </div>

            <p className="text-base text-primary-foreground/80 leading-relaxed">
              We believe that every athlete deserves access to world-class
              facilities. Geography, connections, or budget shouldn't be a
              barrier to finding your perfect venue.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary-foreground uppercase text-sm tracking-wide">
                    Simplify Discovery
                  </h4>
                  <p className="text-xs text-primary-foreground/70 mt-1">
                    Smart search and filtering to find exactly what you need
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary-foreground uppercase text-sm tracking-wide">
                    Build Community
                  </h4>
                  <p className="text-xs text-primary-foreground/70 mt-1">
                    Connect with players, organizers, and sports enthusiasts
                    globally
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-primary-foreground uppercase text-sm tracking-wide">
                    Enable Growth
                  </h4>
                  <p className="text-xs text-primary-foreground/70 mt-1">
                    Tools for organizers to scale and for players to improve
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary mb-3">
                Our Vision
              </p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black uppercase tracking-tight text-primary-foreground leading-[1.1]">
                Global Sports
                <br />
                <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
                  Infrastructure
                </span>
              </h2>
            </div>

            <p className="text-base text-primary-foreground/80 leading-relaxed">
              Court Connect is building the world's most trusted marketplace for
              sports venues. We envision a future where finding, booking, and
              playing at premium facilities is as simple as ordering food.
            </p>

            <div className="bg-primary-foreground/10 p-6 border border-primary-foreground/20 space-y-4">
              <div>
                <h4 className="font-heading font-bold text-primary-foreground uppercase text-sm tracking-wide">
                  By 2027
                </h4>
                <p className="text-sm text-primary-foreground/80 mt-2">
                  5,000+ venues across 25+ countries, 1 million active players,
                  and becoming the sports venue standard globally.
                </p>
              </div>
              <div className="pt-4 border-t border-primary-foreground/10">
                <p className="text-xs font-bold text-primary-foreground/70 uppercase tracking-wider">
                  How We'll Get There
                </p>
                <ul className="mt-3 space-y-2 text-xs text-primary-foreground/70">
                  <li>✓ Expand to 12 new countries</li>
                  <li>✓ Launch AI-powered coach features</li>
                  <li>✓ Build tournament platform</li>
                  <li>✓ Integrate wearable technology</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
