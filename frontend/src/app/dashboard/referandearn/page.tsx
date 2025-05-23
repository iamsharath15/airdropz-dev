'use client';

import React from 'react';
// import HowItWorks from '@/components/HowItWorks';
// import ProfileStats from '@/components/ProfileStats';
// import ReferralTable from '@/components/ReferralTable';
import HowItWorks from './HowItWorks';
import ProfileStats from './ProfileStats';
import ReferralTable from './ReferralTable';

const Page = () => {
  const referralData = {
    totalReferrals: 4,
    totalEarned: 200,
    referralLink: 'https://airdrop.com/ref=1234',
  };

  const referrals = [
    { id: 1, date: '12/04/25', user: 'User 1', points: 50 },
    { id: 2, date: '13/04/25', user: 'User 2', points: 50 },
    { id: 3, date: '14/04/25', user: 'User 3', points: 50 },
    { id: 4, date: '15/04/25', user: 'User 4', points: 50 },
  ];

  return (
    <div className="min-h-screen max-w-[1440px] w-full flex items-center justify-center bg-black">
      <div className="w-11/12 py-12 ">
        <HowItWorks />
        <ProfileStats
          totalReferrals={referralData.totalReferrals}
          totalEarned={referralData.totalEarned}
          referralLink={referralData.referralLink}
        />
        <ReferralTable referrals={referrals} />
      </div>
    </div>
  );
};

export default Page;
