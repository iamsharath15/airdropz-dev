// done v1

import Image from 'next/image';
import React from 'react';

const HowItWorks = () => {
  return (
    <div className="relative bg-[hsl(248,78%,69%)] text-white p-4 sm:p-6 lg:p-8 mb-8 rounded-2xl overflow-hidden">
      <div className="hidden lg:block absolute top-0 right-0 w-4/12 h-full z-0">
        <Image
          src="https://cdn.lootcrate.me/static-image-v1/referandearn/refer-and-earn-img1.png"
          alt="refer & earn image"
          fill
          className="object-cover object-right"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 w-full lg:w-8/12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
          HOW IT WORKS
        </h2>
        <ol className="space-y-2 list-decimal list-inside font-semibold text-xs sm:text-sm md:text-base">
          <li>Get Your Link – Sign up and grab your unique referral link.</li>
          <li>
            Invite Friends – Share the link with friends via social media,
            email, or chat.
          </li>
          <li>
            They Sign Up – Your friends join using your link and start using the
            platform.
          </li>
          <li>
            You Earn Rewards – Get rewarded for every successful referral!
          </li>
        </ol>
      </div>
    </div>
  );
};

export default HowItWorks;
