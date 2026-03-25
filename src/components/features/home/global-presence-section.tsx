import { DottedMap } from "@/components/ui/dotted-map";

// CONSTANTS
const globalMetrics = [
  { id: "venues", value: "420+", label: "Total Venues" },
  { id: "cities", value: "68", label: "Cities Covered" },
  { id: "amenities", value: "150+", label: "Total Amenities" },
  { id: "coming-soon", value: "200+", label: "Coming Soon 2024" },
] as const;

const globalCityMarkers = [
  { lat: 51.5074, lng: -0.1278, size: 0.8, pulse: true },
  { lat: 40.7128, lng: -74.006, size: 0.8, pulse: true },
  { lat: 48.8566, lng: 2.3522, size: 0.8, pulse: true },
  { lat: 35.6762, lng: 139.6503, size: 0.8, pulse: true },
  { lat: 25.2048, lng: 55.2708, size: 0.8, pulse: true },
  { lat: -33.8688, lng: 151.2093, size: 0.8, pulse: true },
  { lat: 52.52, lng: 13.405, size: 0.8, pulse: true },
] as const;

export function GlobalPresenceSection() {
  return (
    <section className="bg-primary px-6 py-16 md:px-10 md:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-12">
        <div>
          <p className="mb-6 text-[10px] font-black uppercase tracking-[0.34em] text-secondary">
            Global Coverage
          </p>

          <h2 className="font-display text-5xl font-black uppercase leading-[0.86] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Global
            <br />
            <span className="text-secondary">Presence.</span>
          </h2>

          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-primary-foreground/80 sm:text-2xl">
            From the concrete courts of New York to the elite fields of London.
            We are where the game happens.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-x-10 gap-y-10 sm:mt-14 sm:gap-x-16 sm:gap-y-12">
            {globalMetrics.map((item) => (
              <article key={item.id}>
                <p className="font-display text-5xl font-black leading-none text-secondary sm:text-6xl">
                  {item.value}
                </p>
                <p className="mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary-foreground/85">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="flex items-stretch">
          <div className="relative h-full min-h-75 w-full overflow-hidden md:min-h-90 lg:min-h-115">
            <DottedMap
              className="h-full w-full brightness-125"
              dotColor="rgba(255,255,255,0.34)"
              markerColor="var(--secondary)"
              markers={[...globalCityMarkers]}
              dotRadius={0.24}
              pulse
              mapSamples={7000}
            />
            {/* <div className="absolute inset-0 bg-primary/25" /> */}
          </div>
        </aside>
      </div>
    </section>
  );
}
