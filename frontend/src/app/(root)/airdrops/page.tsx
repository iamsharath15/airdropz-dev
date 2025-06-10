"use client"
import React from 'react'
import HeroSection from './HeroSection';
import TrustIndicators from './TrustIndicators';
import FeaturesShowcase from './FeaturesShowcase';
import CreativeSuite from './CreativeSuite';
import TargetAudience from './TargetAudience';
import AIModelsShowcase from './AIModelsShowcase';

const page = () => {
  return (
    // <div className='min-h-screen h-full'>page</div>
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden">
      <HeroSection />
      <TrustIndicators />
     <FeaturesShowcase />
      <CreativeSuite />
      <TargetAudience />
      <AIModelsShowcase /> 
    </div>
  )
}

export default page