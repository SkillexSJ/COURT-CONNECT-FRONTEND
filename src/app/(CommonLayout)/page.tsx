import { HeroSection } from "@/components/features/home/hero-section";
import { HomeSections } from "@/components/features/home/home-sections";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col">
      <HomeSections />
    </section>
  );
}
