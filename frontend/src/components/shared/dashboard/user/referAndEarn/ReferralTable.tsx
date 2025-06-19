// done v1

'use client';

import Image from 'next/image';
import React from 'react';

import type { ReferralTableProps } from '@/types';

const ReferralTable: React.FC<ReferralTableProps> = ({ referrals }) => {

  return (
    <div className="rounded-2xl bg-[#151313] p-4 sm:p-6 shadow-sm overflow-x-auto">
      <h2 className="text-lg font-semibold text-white mb-6">My Referrals</h2>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-sm text-left text-muted-foreground border-separate border-spacing-y-3">
          <thead className="text-xs uppercase text-white whitespace-nowrap">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">
                No of
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Date
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                User
              </th>
              <th scope="col" className="px-4 py-2 font-medium text-right">
                Points Earned
              </th>
            </tr>
          </thead>
          <tbody>
            {referrals.length === 0 ? (
              <tr className="bg-black rounded-xl overflow-hidden">
                <td
                  colSpan={4}
                  className="text-center text-white py-6 rounded-xl"
                >
                  No user found
                </td>
              </tr>
            ) : (
              referrals.map((referral) => (
                <tr
                  key={referral.id}
                  className="bg-black rounded-xl overflow-hidden"
                >
                  <td className="px-4 py-3 font-mono text-white rounded-l-xl whitespace-nowrap">
                    {referral.id}.
                  </td>
                  <td className="px-4 py-3 text-white whitespace-nowrap">
                    {referral.join_date}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 text-white">
                    {referral.profile_image ? (
                      <Image
                        width={24}
                        height={24}
                        src={referral.profile_image}
                        alt="user profile"
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-[#8373EE] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                        {referral.user_name.charAt(0)}
                      </div>
                    )}

                    <span className="truncate max-w-[100px]">
                      {referral.user_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-yellow-500 font-medium rounded-r-xl whitespace-nowrap">
                    +{referral.points_earned}
                    <span className="inline-block ml-1 align-middle px-2">
                      <Image
                        src="https://cdn.lootcrate.me/svg/airdrop.svg"
                        alt="Airdrop Logo"
                        width={15}
                        height={15}
                      />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralTable;
