import { HeroSection } from '@/components/landing_page/HeroSection';
import { FeaturesSection } from '@/components/landing_page/FeaturesSection';
import { CTASection } from '@/components/landing_page/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
