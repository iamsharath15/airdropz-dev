'use client';

import Link from "next/link";
import { Airdrop } from "@/types/airdrop";

interface AirdropCardProps {
  airdrop: Airdrop;
}

const AirdropCard = ({ airdrop }: AirdropCardProps) => {
  return (
    <Link href={`/dashboard/airdrops/${airdrop.id}`}>
      <div className="airdrop-card bg-gray-900 rounded-lg overflow-hidden cursor-pointer border border-gray-800">
        <div className={`w-full h-36 flex items-center justify-center airdrop-logo-${airdrop.logoColor}`}>
          <span className="text-4xl font-bold text-black">{airdrop.logo}</span>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-white">{airdrop.name}</h3>
          </div>
          <div className="flex gap-2">
            <span className={`badge-${airdrop.network.toLowerCase()} text-xs px-2 py-1 rounded-full text-white`}>
              #{airdrop.network}
            </span>
            <span className={`badge-${airdrop.status.toLowerCase()} text-xs px-2 py-1 rounded-full text-white`}>
              {airdrop.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AirdropCard;
