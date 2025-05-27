'use client';

import React from 'react';
import { Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfileStatsProps {
  totalReferrals: number;
  totalEarned: number;
  referralLink: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalReferrals,
  totalEarned,
  referralLink,
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard');
  };

  return (
    <div className="rounded-2xl bg-[#151313] p-6 shadow-sm mb-8">
      <div className="flex w-full flex-col md:flex-row">
        <div className="md:w-3/12 w-full flex items-center justify-center p-[2%]">
          <div className="rounded-full bg-[#8373EE] w-[150px] h-[150px] flex items-center justify-center">
            👤
          </div>
        </div>
        <div className="md:w-9/12 w-full flex items-center justify-start flex-col">
          <div className="flex items-center w-full justify-center">
            <div className="flex items-center justify-start  w-6/12 p-[2%] ">
              <div className="bg-black rounded-2xl w-full flex items-center justify-start p-[10%] gap-4">
                <div className=" flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className=" flex items-start justify-center flex-col">
                  <p className="text-sm text-white mb-1">TOTAL REFERRALS</p>
                  <p className="text-3xl font-bold text-white">
                    {totalReferrals}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start  w-6/12 p-[2%] ">
              <div className="bg-black rounded-2xl w-full flex items-center justify-start p-[10%] gap-4">
                <div className=" flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className=" flex items-start justify-center flex-col">
                  <p className="text-sm text-white mb-1">TOTAL EARNED</p>
                  <p className="text-3xl font-bold text-white">{totalEarned}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-2 p-[2%]">
            <p className="text-sm text-white mb-2">YOUR REFERRAL LINK</p>
            <div className="flex flex-col items-start justify-center w-full">
              <div className="w-full flex bg-black justify-between items-center p-[1.5%] rounded-2xl">
                <p className="text-white"> {referralLink}</p>
                <div className="gap-2 flex">
                  <Button
                    variant="secondary"
                    onClick={copyToClipboard}
                    className="cursor-pointer"
                  >
                    Copy link
                  </Button>
                  <Button
                    variant="default"
                    className="bg-[#8373EE] cursor-pointer"
                  >
                    Share
                  </Button>
                </div>
              </div>
              <p className="text-yellow-500 mt-4 font-medium">
                Get 50 💰 for each referral
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
