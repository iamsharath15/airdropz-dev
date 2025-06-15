'use client';
import React, { useRef } from 'react';
import AirdropCard from '../AirdropCard';

type Airdrop = {
  id: string;
  title: string;
  category: string;
  preview_image_url: string;
  type: string;
  likes: string;
};

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
      <button onClick={onPrev} className="text-gray-400 hover:text-white" aria-label="Scroll Left">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button onClick={onNext} className="text-gray-400 hover:text-white" aria-label="Scroll Right">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
);

const AirdropsSection = ({ airdrops }: { airdrops: Airdrop[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-6 md:mb-8 px-4">
      <SectionHeader
        title="Top Liked Airdrops"
        onPrev={() => scroll('left')}
        onNext={() => scroll('right')}
      />
      {airdrops.length === 0 ? (
        <p className="text-gray-400">No liked airdrops yet.</p>
      ) : (
        <div
          ref={scrollRef}
          className="flex flex-row -m-2 gap-4 overflow-x-scroll scroll-smooth scrollbar-hide"
        >
          {airdrops.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AirdropsSection;
