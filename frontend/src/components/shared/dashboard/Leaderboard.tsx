'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type LeaderboardUser = {
  id: number;
  user_name: string;
  points: number;
};

type LeaderboardResponse = {
  success: boolean;
  data: LeaderboardUser[];
  totalCount: number;
};

const fetchLeaderboard = async (
  page: number,
  limit: number
): Promise<LeaderboardResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/v1?limit=${limit}&page=${page}`
  );
  return res.data;
};

const Leaderboard = () => {
  const previewLimit = 5;
  const fullLimit = 5;

  const [showFull, setShowFull] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard', showFull, page],
    queryFn: () =>
      fetchLeaderboard(
        showFull ? page : 1,
        showFull ? fullLimit : previewLimit
      ),
  });

  const disablePrev = page === 1;
  const disableNext = data ? page * fullLimit >= data.totalCount : true;

  return (
    <div className="mt-6 bg-[#171717] rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Leaderboard</h2>
      </div>

      <div>
        <div className="flex text-xs text-gray-400 mb-3 px-2">
          <div className="w-10">Rank</div>
          <div className="flex-1">User name</div>
          <div className="w-24 text-right">Airdrops earned</div>
        </div>

        {isLoading && <div className="text-gray-400 px-2">Loading...</div>}
        {isError && (
          <div className="text-red-500 px-2">Failed to load leaderboard.</div>
        )}
        {!isLoading && data?.data.length === 0 && (
          <div className="text-gray-400 px-2">
            Leaderboard will update soon.
          </div>
        )}

        <div className="space-y-3">
          {data?.data.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center text-sm px-2 bg-black p-4 rounded-xl"
            >
              <div className="w-10 text-white">
                {(page - 1) * fullLimit + index + 1}.
              </div>
              <div className="flex-1 flex items-center gap-2 justify-start overflow-hidden">
                <div className="w-6 h-6 bg-white rounded-full" />
                <span className="text-white">{user.user_name}</span>
              </div>
              <div className="w-24 text-right flex justify-end items-center pr-4">
                <span className="text-yellow-500 pr-3">+ {user.points}</span>
                <Image
                  src="https://cdn.lootcrate.me/svg/airdrop.svg"
                  alt="Airdrop Logo"
                  width={18}
                  height={18}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Full View */}
        {!showFull && (
          <Button
            className="w-full mt-4 bg-[#8373EE] text-white cursor-pointer hover:bg-[#8373EE]/80"
            onClick={() => setShowFull(true)}
          >
            Show More
          </Button>
        )}

        {/* Pagination Controls for Full View */}
        {showFull && (
          <div className="flex justify-between mt-4">
            <Button
              className="text-black hover:bg-[#8373EE] cursor-pointer"
              variant="outline"
              disabled={disablePrev}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </Button>
            <Button
              className="text-black hover:bg-[#8373EE] cursor-pointer"
              variant="outline"
              disabled={disableNext}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
