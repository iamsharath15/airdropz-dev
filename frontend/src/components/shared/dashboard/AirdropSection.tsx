// components/AirdropsSection.tsx
import React from "react";

const airdrops = [
  {
    id: 1,
    name: "Shaga",
    image: "/images/shaga.png",
    tags: ["Gaming", "Web3"],
  },
  {
    id: 2,
    name: "Ostium",
    image: "/images/ostium.png",
    tags: ["DeFi", "Web3"],
  },
  {
    id: 3,
    name: "Hemi Network",
    image: "/images/hemi.png",
    tags: ["Finance", "Web3"],
  },
  // Add more if you want to test responsiveness
];

// SectionHeader same as before
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">{title}</h2>
    <div className="flex gap-2">
      <button className="text-gray-400" aria-label="Previous">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="text-gray-400" aria-label="Next">
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
);

const AirdropCard = ({ airdrop }: { airdrop: typeof airdrops[0] }) => (
  <div className="flex flex-col w-full sm:w-3/12 md:w-4/12 lg:w-5/12 p-2 bg-[#151313] gap-3 rounded-xl">
    <div className="aspect-square bg-gray-700 rounded-xl mb-2 flex items-center justify-center overflow-hidden">
      <img
        src={airdrop.image}
        alt={airdrop.name}
        className="object-cover w-full h-full"
        loading="lazy"
      />
    </div>
    <h3 className="text-white font-semibold">{airdrop.name}</h3>
    <div className="flex gap-2 mt-1 flex-wrap">
      {airdrop.tags.map((tag, index) => (
        <span
          key={index}
          className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const AirdropsSection = () => (
  <section className="mb-6 md:mb-8 px-4">
    <SectionHeader title="My Airdrops" />
    <div className="flex flex-row overflow-hidden -m-2 gap-4 overflow-x-scroll">
      {airdrops.map((airdrop) => (
        <AirdropCard key={airdrop.id} airdrop={airdrop} />
      ))}
    </div>
  </section>
);

export default AirdropsSection;
