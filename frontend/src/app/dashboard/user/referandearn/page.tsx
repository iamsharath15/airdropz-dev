// done v1

'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import HowItWorks from '@/components/shared/dashboard/user/referAndEarn/HowItWorks';
import ReferralTable from '@/components/shared/dashboard/user/referAndEarn/ReferralTable';
import ProfileStats from '@/components/shared/dashboard/user/referAndEarn/ProfileStats';
import { motion } from 'framer-motion';

const SkeletonBox = ({ className = '' }: { className?: string }) => (
  <motion.div
    className={`bg-zinc-800 rounded-md ${className}`}
    animate={{ opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
);

const ReferralSkeleton = () => (
  <div className="w-full space-y-8 py-12">
    <div className="space-y-4">
      <SkeletonBox className="w-40 h-6" />
      <SkeletonBox className="w-2/3 h-4" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SkeletonBox className="h-24" />
      <SkeletonBox className="h-24" />
      <SkeletonBox className="h-24" />
    </div>

    <div className="mt-8 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonBox className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="w-1/2 h-4" />
            <SkeletonBox className="w-1/3 h-4" />
          </div>
          <SkeletonBox className="w-16 h-4" />
        </div>
      ))}
    </div>
  </div>
);

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
    queryFn: fetchReferralStats
  });
 if (isLoading) {
  return (
    <div className="min-h-screen max-w-[1440px] w-full flex justify-center bg-black">
      <div className="w-11/12">
        <ReferralSkeleton />
      </div>
    </div>
  );
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
      (sum: number, item: { points_earned: number }) =>
        sum + item.points_earned,
      0
    ),
    referral_code: data.referral_code,
  };

  const referrals = data.user_details.map(
    (
      entry: {
        join_date: string;
        user_name: string;
        points_earned: number;
        profile_image: string;
      },
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
