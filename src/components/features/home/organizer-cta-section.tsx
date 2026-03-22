export function OrganizerCtaSection() {
  return (
    <section className="bg-surface px-6 py-32 text-center md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-5xl font-black uppercase leading-none tracking-tight text-primary md:text-7xl">
          List Your Venue.
          <br />
          <span className="bg-secondary px-3 py-1">Scale Your Impact.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-on-surface-variant">
          Join a premium network of sports facilities and manage bookings,
          analytics, and member growth from one platform.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 md:flex-row">
          <button className="bg-primary px-10 py-5 font-display text-sm font-black uppercase tracking-widest text-secondary">
            Get Started Today
          </button>
          <button className="border-2 border-primary px-10 py-5 font-display text-sm font-black uppercase tracking-widest text-primary transition hover:bg-primary hover:text-surface">
            Partner Portal
          </button>
        </div>
      </div>
    </section>
  );
}
