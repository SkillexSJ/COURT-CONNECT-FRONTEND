/**
 * THIS IS  A SHARED COMPONENT USED  FROM KEBO UI
 */

import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import {
  Testimonial,
  TestimonialQuote,
  TestimonialAuthor,
  TestimonialAvatar,
  TestimonialAvatarImg,
  TestimonialAvatarRing,
  TestimonialAuthorName,
  TestimonialAuthorTagline,
  TestimonialVerifiedBadge,
} from "@/components/ui/testmonials-marquee";

export function TestimonialsMarqueeDemo2() {
  return (
    <section className="bg-background py-20 md:py-24 lg:py-28">
      <div className="mx-auto w-full  px-6 md:px-10 lg:px-12">
        <div className="mb-12 text-center md:mb-14 lg:mb-16 lg:text-left">
          <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            Athlete
            <br />
            <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
              Testimonials
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg lg:mx-0 lg:max-w-2xl">
            Real feedback from players, coaches, and organizers using Court
            Connect to discover, book, and manage premium sports venues.
          </p>
        </div>
      </div>

      <div className="relative w-full space-y-4 overflow-hidden border-y border-primary/15 bg-muted/10 [&_.rfm-initial-child-container]:items-stretch! [&_.rfm-marquee]:items-stretch!">
        {[TESTIMONIALS_1, TESTIMONIALS_2].map((list, index) => (
          <Marquee
            key={index}
            className="border-y border-primary/15 bg-muted/5"
          >
            <MarqueeFade
              side="left"
              className="from-background via-background/95 to-transparent w-24 sm:w-32 z-30"
            />
            <MarqueeFade
              side="right"
              className="from-background via-background/95 to-transparent w-24 sm:w-32 z-30"
            />

            <MarqueeContent direction={index % 2 === 1 ? "right" : "left"}>
              {list.map((item, i) => (
                <MarqueeItem
                  key={i}
                  className="mx-0 h-full w-xs border-r border-secondary"
                >
                  <div
                    className="block h-full transition-colors duration-300 hover:bg-primary"
                  >
                    <Testimonial className="h-full border-l-2 hover:text-secondary  border-transparent transition-colors duration-300 hover:border-l-secondary/85">
                      <TestimonialQuote className="px-5 py-4  text-sm leading-relaxed text-on-surface italic md:text-base">
                        <p>{item.quote}</p>
                      </TestimonialQuote>

                      <TestimonialAuthor className="px-5 pt-1 pb-4">
                        <TestimonialAvatar>
                          <TestimonialAvatarImg src={item.authorAvatar} />
                          <TestimonialAvatarRing className="ring-primary/25" />
                        </TestimonialAvatar>

                        <TestimonialAuthorName className="text-sm   font-black uppercase tracking-[0.08em] text-primary">
                          {item.authorName}
                          <TestimonialVerifiedBadge className="text-primary" />
                        </TestimonialAuthorName>

                        <TestimonialAuthorTagline className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary/65">
                          {item.authorTagline}
                        </TestimonialAuthorTagline>
                      </TestimonialAuthor>
                    </Testimonial>
                  </div>
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        ))}
      </div>
    </section>
  );
}

export const TESTIMONIALS_1 = [
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    authorName: "Alex Chen",
    authorTagline: "Amateur Footballer",
    url: "#",
    quote:
      "I found a high-quality turf near my office in under five minutes. Booking and payment were both instant.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    authorName: "Sarah Miller",
    authorTagline: "Triathlon Athlete",
    url: "#",
    quote:
      "The venue filters are excellent. I can quickly pick courts by lighting and amenities before morning training sessions.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    authorName: "James Wilson",
    authorTagline: "Weekend Tennis Player",
    url: "#",
    quote:
      "Court Connect made weekend match planning effortless. My group now books one week ahead without any friction.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
    authorName: "Maya Patel",
    authorTagline: "Basketball Coach",
    url: "#",
    quote:
      "Consistent court quality and simple checkout. It has become the default booking platform for our academy sessions.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    authorName: "David Kim",
    authorTagline: "Badminton Enthusiast",
    url: "#",
    quote:
      "I love how transparent the pricing is. No hidden surprises, and confirmations arrive immediately after payment.",
  },
];

export const TESTIMONIALS_2 = [
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    authorName: "Robert Fox",
    authorTagline: "Venue Organizer",
    url: "#",
    quote:
      "As an organizer, I can manage bookings and slot visibility in one dashboard. Operations are much smoother now.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    authorName: "Emily Zhang",
    authorTagline: "Padel Player",
    url: "#",
    quote:
      "The platform helps me compare venues quickly and choose the right one for league prep sessions.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    authorName: "Michael Brown",
    authorTagline: "Academy Manager",
    url: "#",
    quote:
      "Verification and admin controls are strong. It gives our players confidence that facilities meet a professional standard.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    authorName: "Lisa Wang",
    authorTagline: "Recreational Runner",
    url: "#",
    quote:
      "UI is clean and fast. Even on mobile, finding and reserving a venue near me takes less than two minutes.",
  },
  {
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    authorName: "Chris Johnson",
    authorTagline: "Table Tennis Player",
    url: "#",
    quote:
      "I added Court Connect to our club workflow. Booking disputes dropped because all confirmations are clear and centralized.",
  },
];

export const TestimonialsSection = TestimonialsMarqueeDemo2;
