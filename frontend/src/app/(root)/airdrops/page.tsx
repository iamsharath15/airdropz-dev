'use client';
import React from 'react';
// import HeroSection from './HeroSection';
// import TrustIndicators from './TrustIndicators';
// import FeaturesShowcase from './FeaturesShowcase';
// import CreativeSuite from './CreativeSuite';
// import TargetAudience from './TargetAudience';
// import AIModelsShowcase from './AIModelsShowcase';
import AirdropsHeroSection from '@/components/shared/landingPage/Aidrops/AirdropsHeroSection';
import TopAidropsSection from '@/components/shared/landingPage/Aidrops/TopAidropsSection';

const page = () => {
  return (
    <div className="min-h-screen h-full">
      <AirdropsHeroSection />
      <TopAidropsSection />
    </div>
    // <div className='min-h-screen h-full'>page</div>
    // <div className="min-h-screen bg-black text-foreground overflow-x-hidden">
    //   <HeroSection />
    //   <TrustIndicators />
    //  <FeaturesShowcase />
    //   <CreativeSuite />
    //   <TargetAudience />
    //   <AIModelsShowcase />
    // </div>
  );
};

export default page;
