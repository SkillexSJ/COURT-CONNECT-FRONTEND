import Link from "next/link";

const stats = [
  { label: "Active Venues", value: "1000+" },
  { label: "Lifetime Bookings", value: "50K+", highlight: true },
  { label: "Players Connected", value: "100K+" },
  { label: "Countries", value: "12+" },
];

export function AboutHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-360 mx-auto w-full text-center space-y-8">
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight text-primary">
          Discover Elite
          <br />
          <span className="mt-1 inline-block bg-secondary px-3 py-1 text-primary">
            Venues Await
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Court Connect is revolutionizing how athletes and teams discover,
          book, and play at premium sports venues worldwide. From casual players
          to professional organizers, we connect you with the perfect venue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/venues"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 font-bold uppercase text-sm tracking-[0.12em] hover:bg-primary/90 transition-colors"
          >
            Explore Venues
          </Link>
          <Link
            href="/organizers"
            className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 py-2.5 font-bold uppercase text-sm tracking-[0.12em] hover:bg-primary/5 transition-colors"
          >
            Browse Organizers
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4  pt-10 border-t border-border">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 py-4 ${!stat.highlight ? "sm:py-6" : ""}`}
            >
              <p
                className={`font-heading font-black tracking-tighter ${
                  stat.highlight
                    ? "text-3xl sm:text-4xl text-secondary"
                    : "text-2xl sm:text-3xl text-primary"
                }`}
              >
                {stat.value}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
