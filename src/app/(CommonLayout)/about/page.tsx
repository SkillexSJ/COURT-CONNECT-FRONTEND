/* eslint-disable react/no-unescaped-entities */
import {
  AboutEcosystem,
  AboutHero,
  AboutMissionVision,
  AboutPartners,
  AboutTeam,
  AboutWhyChoose,
} from "@/components/features/about";

const AboutPage = () => {
  return (
    <main className="bg-background w-full overflow-x-clip">
      <AboutHero />
      <AboutMissionVision />
      <AboutWhyChoose />

      <AboutEcosystem />
      <AboutTeam />
      <AboutPartners />
    </main>
  );
};

export default AboutPage;
