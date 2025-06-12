import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

interface LeaderboardUser {
  id: string;
  user_id: string;
  user_name: string;
  points: number;
}

const SectionHeader = ({
  title,
  onPrev,
  onNext,
}: {
  title: string;
  onPrev: () => void;
  onNext: () => void;
}) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <div className="flex gap-2">
      <button onClick={onPrev} className="text-gray-400 cursor-pointer hover:text-[#8373EE]">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button onClick={onNext} className="text-gray-400  cursor-pointer hover:text-[#8373EE]">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
);

const LeaderboardItem = ({
  user,
  rank,
}: {
  user: LeaderboardUser;
  rank: number;
}) => (
  <div className="bg-[#151313] rounded-xl p-4 flex items-start justify-center gap-4 w-4/12 flex-col">
    <div className="flex flex-row gap-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-[#8373EE]">
        {user.user_name.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="text-white font-semibold">{user.user_name}</h4>
        <p className="text-sm text-gray-400">Free tier</p>
      </div>
    </div>
    <div className="text-right flex flex-row justify-between items-center w-full">
      <div className="flex items-center gap-2 text-white text-sm">
        <Image
          src="https://cdn.lootcrate.me/svg/Rank.svg"
          alt="Rank Icon"
          width={15}
          height={15}
        />
        {rank} Rank
      </div>{' '}
      <div className="flex items-center gap-2 text-white text-sm">
          <Image
          src="https://cdn.lootcrate.me/svg/airdrop.svg"
          alt="Airdropz Icon"
          width={15}
          height={15}
        />
        {user.points} Airdropz</div>
    </div>
  </div>
);

const LeaderboardSection = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const usersPerPage = 3;

  const {
    data: leaderboardData,
    isLoading,
    isError,
    error,
  } = useQuery<LeaderboardUser[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8080/api/leaderboard/v1/');
      return res.data.data;
    },
  });

  const handlePrev = () => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    const totalPages = leaderboardData
      ? Math.ceil(leaderboardData.length / usersPerPage)
      : 1;
    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  if (isLoading)
    return <div className="text-white">Loading leaderboard...</div>;
  if (isError)
    return (
      <div className="text-red-500">
        Error: {(error as Error).message || 'Failed to load leaderboard'}
      </div>
    );

  const sortedData = leaderboardData
    ? [...leaderboardData]
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
        }))
    : [];

  const usersToDisplay = sortedData.slice(
    pageIndex * usersPerPage,
    pageIndex * usersPerPage + usersPerPage
  );

  return (
    <div className="mb-6 md:mb-8 overflow-hidden">
      <SectionHeader
        title="Leaderboard"
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <div className="flex flex-row overflow-x-auto gap-4">
        {usersToDisplay.map((user) => (
          <LeaderboardItem key={user.user_id} user={user} rank={user.rank} />
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSection;
