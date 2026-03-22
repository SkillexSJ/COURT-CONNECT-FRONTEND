/* eslint-disable @next/next/no-img-element */

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=2000&q=80"
          alt="Athletic action"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/30 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-12">
        <div className="max-w-4xl">
          <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.85] tracking-tight text-surface">
            The Arena
            <br />
            <span className="text-secondary">Awaits.</span>
          </h1>
        </div>

        <div className="mt-12 grid max-w-5xl grid-cols-1 gap-0 bg-surface p-1 md:grid-cols-[1fr_auto]">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                What sport?
              </p>
              <input
                className="w-full border-0 bg-transparent p-0 font-display text-lg font-bold"
                placeholder="Football, Tennis..."
              />
            </div>
            <div className="p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Where?
              </p>
              <input
                className="w-full border-0 bg-transparent p-0 font-display text-lg font-bold"
                placeholder="Enter city"
              />
            </div>
            <div className="p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Date
              </p>
              <input
                className="w-full border-0 bg-transparent p-0 font-display text-lg font-bold"
                placeholder="Select date"
              />
            </div>
          </div>
          <button className="bg-primary px-10 py-6 font-display text-sm font-black uppercase tracking-widest text-secondary transition hover:brightness-110">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
