'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import HowItWorks from './HowItWorks';
import ProfileStats from './ProfileStats';
import ReferralTable from './ReferralTable';

const fetchReferralStats = async () => {
  const { data } = await axios.get('http://localhost:8080/api/referral/v1/stats', { withCredentials: true });
  return data;
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
    return <div className="text-red-500 text-center mt-10">Failed to load referral data.</div>;
  }

const referralData = {
  totalReferrals: data.totalReferrals,
  totalEarned: data.history.reduce((sum: number, item: { pointsEarned: number }) => sum + item.pointsEarned, 0),
  referralLink: data.referralLink,
};

const referrals = data.history.map((entry: { date: string; username: string; pointsEarned: number }, index: number) => ({
  id: index + 1,
  date: new Date(entry.date).toLocaleDateString(),
  user: entry.username,
  points: entry.pointsEarned,
}));



  // const referralData = {
  //   totalReferrals: 4,
  //   totalEarned: 200,
  //   referralLink: 'https://airdrop.com/ref=1234',
  // };

  // const referrals = [
  //   { id: 1, date: '12/04/25', user: 'User 1', points: 50 },
  //   { id: 2, date: '13/04/25', user: 'User 2', points: 50 },
  //   { id: 3, date: '14/04/25', user: 'User 3', points: 50 },
  //   { id: 4, date: '15/04/25', user: 'User 4', points: 50 },
  // ];

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
