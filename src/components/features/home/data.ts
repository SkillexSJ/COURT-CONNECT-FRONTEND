export type Step = {
  id: string;
  title: string;
  description: string;
};

export type Membership = {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  featured?: boolean;
  perks: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
};

export type Venue = {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  verified?: boolean;
  image: string;
};

export const navLinks = ["Browse", "Venues", "Memberships", "Journal"];

export const steps: Step[] = [
  {
    id: "01",
    title: "Discover",
    description:
      "Filter by amenities, playing surface, lighting quality, and location across premium venues.",
  },
  {
    id: "02",
    title: "Reserve",
    description:
      "Book instantly with integrated payments and confirmation in seconds.",
  },
  {
    id: "03",
    title: "Compete",
    description:
      "Arrive at verified spaces engineered for consistent performance.",
  },
];

export const memberships: Membership[] = [
  {
    id: "pro",
    name: "Athletic Pro",
    price: 29,
    period: "month",
    description: "The standard for the modern amateur athlete.",
    perks: ["24-hour early access", "10% off all bookings"],
  },
  {
    id: "elite",
    name: "Inner Circle Elite",
    price: 79,
    period: "month",
    description: "Unprecedented access to the world's finest venues.",
    featured: true,
    perks: [
      "7-day priority booking",
      "20% off all bookings",
      "VIP lounge and concierge",
      "Complimentary gear service",
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "marcus",
    name: "Marcus Chen",
    role: "Pro Basketballer",
    quote:
      "The quality of venues on this platform is unmatched. As a pro, I need consistency.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "sarah",
    name: "Sarah Jenkins",
    role: "Triathlete",
    quote:
      "Booking used to be a headache. Now it is the easiest part of my weekly training flow.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "david",
    name: "David Miller",
    role: "Tennis Coach",
    quote:
      "Finally a platform that treats amateur sport with professional respect.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
];

export const trendingVenues: Venue[] = [
  {
    id: "v1",
    name: "Titanium Arena Complex",
    location: "Los Angeles, CA",
    pricePerHour: 120,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "v2",
    name: "Skyline Tennis Club",
    location: "San Diego, CA",
    pricePerHour: 85,
    image:
      "https://images.unsplash.com/photo-1520627977056-c307eb3a94a8?auto=format&fit=crop&w=1000&q=80",
  },
];

export const cityStats = [
  { city: "London", count: "120+" },
  { city: "New York", count: "85+" },
  { city: "Paris", count: "40+" },
  { city: "Coming Soon", count: "200+" },
];
