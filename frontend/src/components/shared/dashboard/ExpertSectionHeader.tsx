'use client';

import { Button } from '@/components/ui/button';
import { CirclePlay } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const ExpertSectionHeader = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8373EE] to-[#5E50C1] p-6 sm:p-8 lg:p-10 text-white mb-10 shadow-lg">
      {/* Background Image */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-5/12">
        <Image
          src="https://cdn.lootcrate.me/static-image-v1/referandearn/refer-and-earn-img1.png"
          alt="Refer and Earn Illustration"
          fill
          className="object-cover object-right opacity-90"
          priority
        />
      </div>

      {/* Text Content */}
      <div className="relative z-10 w-full lg:w-7/12">
        <span className="inline-block px-3 py-1 mb-3 bg-white/20 text-xs sm:text-sm font-medium rounded-full backdrop-blur-md shadow-sm">
          🎯 Premium Feature
        </span>

        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
          Expert Analysis
        </h2>

        <p className="text-base sm:text-lg md:text-xl font-medium text-white/90 leading-relaxed mb-4">
          Gain insights and make smarter decisions with professional recommendations.
        </p>

        <Button
          className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full bg-white text-black hover:bg-gray-200 transition duration-300"
          aria-label="Join Expert Analysis"
        >
          Join Now <CirclePlay className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default ExpertSectionHeader;
