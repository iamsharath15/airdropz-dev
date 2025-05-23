import Image from 'next/image';
import React from 'react';

const HowItWorks = () => {
  return (
    <div className="bg-[#8373EE] text-white p-6 lg:p-8 mb-8 rounded-2xl relative">
      {/* Right-side background image */}
      <div className="absolute top-0 right-0 hidden lg:block w-4/12 h-full z-0">
        <Image
          src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/static-image-v1/referandearn/refer-and-earn-img1.png"
          alt="refer & earn image"
          fill
          className="object-cover object-right"
        />{' '}
      </div>

      {/* Text content */}
      <div className="z-10 w-full lg:w-8/12">
        <h2 className="md:text-2xl sm:text-xl text-lg font-bold mb-4">
          HOW IT WORKS
        </h2>
        <ol className="space-y-2 list-decimal list-inside font-semibold md:text-lg sm:text-sm text-xs">
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
