import { HeroSection } from "@/components/tuitions/HeroSection";
import { FeaturedTuitions } from "@/components/tuitions/FeaturedTuitions";
import { HowItWorks } from "@/components/tuitions/HowItWorks";
import { SubjectsAndStats } from "@/components/tuitions/SubjectsAndStats";
import { PricingSection } from "@/components/tuitions/PricingSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedTuitions />
      <HowItWorks />
      <SubjectsAndStats />
      <PricingSection />
    </main>
  );
}
