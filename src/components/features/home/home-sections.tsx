import { AnnouncementSection } from "./announcement-section";
import { FeaturedSpotlightSection } from "./featured-spotlight-section";
import { GlobalPresenceSection } from "./global-presence-section";
import { HeroSection } from "./hero-section";

import { HowItWorksSection } from "./how-it-works-section";
import { OrganizerCtaSection } from "./organizer-cta-section";
import { TestimonialsSection } from "./testimonials-section";
import { TrendingVenuesSection } from "./trending-venues-section";

export function HomeSections() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <div className="space-y-0">
        <HeroSection />
        <AnnouncementSection />
      </div>

      <div className="pt-10 md:pt-14 lg:pt-18">
        <div className="pt-10 md:pt-14 lg:pt-16">
          <HowItWorksSection />
        </div>
        <div className="pt-10 md:pt-14 lg:pt-16">
          <FeaturedSpotlightSection />
        </div>
        <div className="pt-10 md:pt-14 lg:pt-16">
          <TestimonialsSection />
        </div>
        <div className="pt-10 md:pt-14 lg:pt-16">
          <TrendingVenuesSection />
        </div>
        <div className="pt-10 md:pt-14 lg:pt-16">
          <GlobalPresenceSection />
        </div>
        <div className="pt-10 md:pt-14 lg:pt-16">
          <OrganizerCtaSection />
        </div>
      </div>
    </main>
  );
}
