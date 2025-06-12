'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
    `http://localhost:8080/api/leaderboard/v1?limit=${limit}&page=${page}`
  );
  return res.data;
};

const Leaderboard = () => {
  const previewLimit = 5;
  const fullLimit = 5;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);

  const {
    data: previewData,
    isLoading: isPreviewLoading,
    isError: isPreviewError,
  } = useQuery({
    queryKey: ['leaderboard-preview'],
    queryFn: () => fetchLeaderboard(1, previewLimit),
  });

  const {
    data: modalData,
    isLoading: isModalLoading,
    isError: isModalError,
  } = useQuery({
    queryKey: ['leaderboard-full', modalPage],
    queryFn: () => fetchLeaderboard(modalPage, fullLimit),
    enabled: modalOpen,
  });

  const disablePrev = modalPage === 1;
  const disableNext = modalData
    ? modalPage * fullLimit >= modalData.totalCount
    : true;

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

        {isPreviewLoading && (
          <div className="text-gray-400 px-2">Loading...</div>
        )}
        {isPreviewError && (
          <div className="text-red-500 px-2">Failed to load leaderboard.</div>
        )}
        {!isPreviewLoading && previewData?.data.length === 0 && (
          <div className="text-gray-400 px-2">
            Leaderboard will update soon.
          </div>
        )}

        <div className="space-y-3">
          {previewData?.data.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center text-sm px-2 bg-black p-4 rounded-xl"
            >
              <div className="w-10 text-white">{index + 1}.</div>
              <div className="flex-1 flex items-center gap-2 justify-start overflow-hidden">
                <div className="w-6 h-6 bg-white rounded-full" />
                <span className="text-white">{user.user_name}</span>
              </div>
              <div className="w-24 text-right flex justify-end items-center">
                <span className="text-yellow-500 mr-1">+ {user.points}</span>
                <svg
                  className="w-4 h-4 text-yellow-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button and Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4 bg-[#8373EE] text-white hover:bg-purple-600/80">
              Show More
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-[#1f1f1f] text-white border-none">
            <DialogTitle className="text-lg font-semibold mb-4">
              Full Leaderboard
            </DialogTitle>

            {/* Header Row */}
            <div className="flex text-sm text-gray-400 border-b border-gray-700 pb-2 mb-2">
              <div className="w-10">Rank</div>
              <div className="flex-1">Username</div>
              <div className="w-24 text-right">Points</div>
            </div>

            {/* Leaderboard Items */}
            {isModalLoading && <p className="text-gray-400">Loading...</p>}
            {isModalError && (
              <p className="text-red-500">Failed to load leaderboard.</p>
            )}

            <div className="space-y-2">
              {modalData?.data.map((user, index) => (
                <div key={user.id} className="flex items-center text-sm">
                  <div className="w-10 text-white">
                    {(modalPage - 1) * fullLimit + index + 1}.
                  </div>
                  <div className="flex-1 text-white">{user.user_name}</div>
                  <div className="w-24 text-right text-yellow-500">
                    + {user.points}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                disabled={disablePrev}
                onClick={() => setModalPage((prev) => prev - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                disabled={disableNext}
                onClick={() => setModalPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Leaderboard;
