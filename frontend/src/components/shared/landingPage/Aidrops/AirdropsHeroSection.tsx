import Link from 'next/link';
import React from 'react';

const AirdropsHeroSection = () => {
  return (
    <section className="bg-black w-full flex items-center justify-center flex-col pt-[8%]">
      <div className="flex flex-col w-10/12 items-center justify-center">
        <div className="flex items-center justify-center w-full flex-col gap-4">
          <h1 className="text-white text-5xl font-bold">
            Claim, Earn. Repeat..
          </h1>
          <p className="text-3xl font-normal text-center text-[#999999]">
            Explore trending airdrops and <br></br> start collecting rewards.
          </p>
          <Link
            href="/signup"
            className="bg-[#8373EE] hover:bg-[#8373EE]/90 text-white font-semibold py-3 md:px-5 px-3 rounded-full transition text-sm mt-2"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AirdropsHeroSection;
