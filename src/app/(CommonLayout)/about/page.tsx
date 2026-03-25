/* eslint-disable react/no-unescaped-entities */
import {
  AboutEcosystem,
  AboutHero,
  AboutMissionVision,
  AboutPartners,
  AboutTeam,
  AboutWhyChoose,
} from "@/components/features/about";
import React from "react";

const AboutPage = () => {
  return (
    <main className="bg-background">
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
