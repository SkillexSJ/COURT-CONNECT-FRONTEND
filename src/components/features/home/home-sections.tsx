import { AnnouncementSection } from "./announcement-section";
import { FeaturedSpotlightSection } from "./featured-spotlight-section";
import { GlobalPresenceSection } from "./global-presence-section";
import { HeroSection } from "./hero-section";

import { HowItWorksSection } from "./how-it-works-section";
import { MembershipSection } from "./membership-section";
import { OrganizerCtaSection } from "./organizer-cta-section";
import { TestimonialsSection } from "./testimonials-section";
import { TrendingVenuesSection } from "./trending-venues-section";

export function HomeSections() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <AnnouncementSection />
      <HowItWorksSection />
      <FeaturedSpotlightSection />
      <MembershipSection />
      <TestimonialsSection />
      <TrendingVenuesSection />
      <GlobalPresenceSection />
      <OrganizerCtaSection />
      
    </main>
  );
}
