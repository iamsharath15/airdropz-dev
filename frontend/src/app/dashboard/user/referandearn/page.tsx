// done v1

'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import HowItWorks from './HowItWorks';
import ProfileStats from './ProfileStats';
import ReferralTable from './ReferralTable';

const fetchReferralStats = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/referral/v1/stats`,
    { withCredentials: true }
  );
  return data.data;
};

const Page = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['referralStats'],
    queryFn: fetchReferralStats,
  });
  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load referral data.
      </div>
    );
  }

  const referralData = {
    total_referrals: data.total_referrals,
    total_earned: data.user_details.reduce(
      (sum: number, item: { points_earned: number }) => sum + item.points_earned,
      0
    ),
    referral_code: data.referral_code,
  };

  const referrals = data.user_details.map(
    (
      entry: { join_date: string; user_name: string; points_earned: number, profile_image:string },
      index: number
    ) => ({
      id: index + 1,
      join_date: new Date(entry.join_date).toLocaleDateString(),
      profile_image: entry.profile_image,
      user_name: entry.user_name,
      points_earned: entry.points_earned,
    })
  );

  return (
    <div className="min-h-screen max-w-[1440px] w-full flex items-center justify-center bg-black">
      <div className="w-11/12 py-12 ">
        <HowItWorks />
        <ProfileStats
          total_referrals={referralData.total_referrals}
          total_earned={referralData.total_earned}
          referral_code={referralData.referral_code}
        />
        <ReferralTable referrals={referrals} />
      </div>
    </div>
  );
};

export default Page;
