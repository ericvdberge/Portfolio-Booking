import { HeroSection } from '@/components/landing_page/HeroSection';
import { CategorySection } from '@/components/landing_page/CategorySection';
import { FeaturesSection } from '@/components/landing_page/FeaturesSection';
import { FeaturedLocationsSection } from '@/components/landing_page/FeaturedLocationsSection';
import { CTASection } from '@/components/landing_page/CTASection';

export default function Home() {

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <div className="py-6 sm:py-8">
        <FeaturesSection />
      </div>
      <FeaturedLocationsSection />
      <div className="py-6 sm:py-8">
        <CTASection />
      </div>
    </div>
  );
}
