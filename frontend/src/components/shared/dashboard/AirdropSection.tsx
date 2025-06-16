'use client';
import React, { useRef } from 'react';
import AirdropCard from '../AirdropCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Airdrop = {
  id: string;
  title: string;
  category: string;
  preview_image_url: string;
  type: 'Free' | 'Paid';
  likes: string;
};

const AidropHeader = ({
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
      <button
        onClick={onPrev}
        className="text-white/80 hover:text-[#8373EE] cursor-pointer "
        aria-label="Scroll Left"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={onNext}
        className="text-white/80 hover:text-[#8373EE] cursor-pointer"
        aria-label="Scroll Right"
      >
        <ChevronRight />
      </button>
    </div>
  </div>
);

const AirdropsSection = ({
  airdrops,
  title = 'Top Airdrops',
  emptyMessage = 'No airdrops to show yet.',
}: {
  airdrops: Airdrop[];
  title?: string;
  emptyMessage?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-6 md:mb-8">
      <AidropHeader title={title} onPrev={() => scroll('left')} onNext={() => scroll('right')} />
      {airdrops.length === 0 ? (
        <div className="bg-[#151313] h-50 w-full flex items-center justify-center rounded-xl">
          <p className="text-white/80 text-lg font-medium">{emptyMessage}</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex flex-row -m-2 w-full gap-4 overflow-x-scroll scroll-smooth scrollbar-hide"
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
