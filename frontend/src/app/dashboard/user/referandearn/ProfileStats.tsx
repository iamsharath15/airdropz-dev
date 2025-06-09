'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Facebook, Instagram, Share2, Users } from 'lucide-react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
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
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.username || 'User';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral code copied to clipboard');
  };
  const shareOnPlatform = (platform: string) => {
    const encodedLink = encodeURIComponent(referralLink);
    const encodedMessage = encodeURIComponent('Join me and earn rewards! 🎉');

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedLink}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case 'instagram':
        toast.info(
          "Instagram doesn't support direct link sharing from browser. Copy the link manually."
        );
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };
  return (
    <div className="rounded-2xl bg-[#151313] p-6 shadow-sm mb-8">
      <div className="flex w-full flex-col md:flex-row">
        <div className="md:w-3/12 w-full flex items-center justify-center p-[2%]">
          <div className="rounded-full bg-[#8373EE] w-[150px] h-[150px] flex items-center justify-center font-bold text-3xl">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="md:w-9/12 w-full flex items-center justify-start flex-col">
          <div className="flex items-center w-full justify-center md:flex-row flex-col py-2">
            <div className="flex items-center justify-start md:w-6/12 w-full p-[2%] ">
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
            <div className="flex items-center justify-start md:w-6/12 w-full p-[2%] ">
              <div className="bg-black rounded-2xl w-full flex items-center justify-start p-[10%] gap-4">
                <div className=" flex items-center justify-center">
                  <Image
                    src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/svg/airdrop.svg"
                    alt="Airdrop Logo"
                    width={40}
                    height={40}
                  />{' '}
                </div>
                <div className=" flex items-start justify-center flex-col">
                  <p className="text-sm text-white mb-1">TOTAL EARNED</p>
                  <p className="text-3xl font-bold text-white">{totalEarned}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-2 p-[2%]">
            <p className="text-sm text-white mb-2">YOUR REFERRAL CODE</p>

            <div className="flex flex-col items-start justify-center w-full">
              <div className="w-full flex bg-black justify-between items-center p-[1.5%] rounded-2xl flex-row gap-4 ">
                <p className="text-white break-all text-sm px-2 md:w-6/12 w-7/12">
                  {referralLink}
                </p>

                {/* Buttons */}
                <div className="gap-2 flex overflow-hidden md:w-6/12 w-5/12">
                  {/* Copy Button */}
                  <Button
                    variant="secondary"
                    onClick={copyToClipboard}
                    className="cursor-pointer gap-2 w-1/2"
                  >
                    {/* Show icon on mobile */}
                    <Copy className="h-2 w-2 block md:hidden" />
                    {/* Show icon + text on desktop */}
                    <span className="hidden md:inline-flex gap-2 items-center">
                      <Copy className="h-4 w-4" /> Copy
                    </span>
                  </Button>

                  {/* Share Dropdown */}
                  <div className="relative group inline-block w-1/2 ">
                    <div className="flex">
                      <Button
                        variant="default"
                        className="bg-[#8373EE] cursor-pointer flex items-center gap-2 w-full"
                      >
                        {/* Mobile icon only */}
                        <Share2 className="h-2 w-2 block md:hidden" />
                        {/* Desktop icon + text */}
                        <span className="hidden md:inline-flex items-center gap-2">
                          <Share2 className="h-4 w-4" /> Share
                        </span>
                      </Button>
                    </div>

                    {/* Dropdown menu */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col gap-2 p-2 bg-[#1c1c1c] border border-gray-800 rounded-xl top-full mt-2 right-0 z-10 min-w-[160px]">
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 text-white hover:bg-[#075E54]/40 hover:text-white cursor-pointer"
                        onClick={() => shareOnPlatform('whatsapp')}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 text-white hover:bg-[#4267B2]/40 hover:text-white cursor-pointer"
                        onClick={() => shareOnPlatform('facebook')}
                      >
                        <Facebook className="h-4 w-4 text-blue-600" />
                        Facebook
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 text-white hover:bg-[#C13584]/40 hover:text-white cursor-pointer"
                        onClick={() => shareOnPlatform('instagram')}
                      >
                        <Instagram className="h-4 w-4 text-pink-500" />
                        Instagram
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reward Text */}
              <p className="text-yellow-500 mt-4 font-medium flex items-center gap-1">
                Get 50
                <span className="inline-block px-1">
                  <Image
                    src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/svg/airdrop.svg"
                    alt="Airdrop Logo"
                    width={15}
                    height={15}
                  />
                </span>
                for each referral
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
