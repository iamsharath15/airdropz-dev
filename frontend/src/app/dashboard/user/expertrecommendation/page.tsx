"use client";

import { useMemo } from "react";
import StoryCarousel from "./StoryCarousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define TypeScript interfaces
interface Task {
  id: number;
  title: string;
  description: string;
  potential: string;
  risk: string;
}

interface Story {
  id: number;
  name: string;
  avatar: string;
  color: string;
  tasks: Task[];
}

const Index = () => {
  // Memoize stories to avoid recalculating on every render
  const stories: Story[] = useMemo(() => [
    {
      id: 1,
      name: "Ethereum",
      avatar: "🔷",
      color: "from-blue-500 to-purple-600",
      tasks: [
        {
          id: 1,
          title: "Complete ETH Staking",
          description: "Stake your ETH tokens to earn rewards and support the network. Minimum stake of 32 ETH required for validation.",
          potential: "High",
          risk: "Low"
        },
        {
          id: 2,
          title: "Deploy Smart Contract",
          description: "Deploy your first smart contract on Ethereum mainnet using Remix IDE or Hardhat framework.",
          potential: "Very High",
          risk: "Medium"
        },
        {
          id: 3,
          title: "Use DeFi Protocols",
          description: "Interact with major DeFi protocols like Uniswap, Aave, and Compound to maximize your yield.",
          potential: "High",
          risk: "Medium"
        },
        {
          id: 4,
          title: "NFT Trading",
          description: "Buy, sell, and trade NFTs on OpenSea and other marketplaces to participate in the NFT ecosystem.",
          potential: "Medium",
          risk: "High"
        },
        {
          id: 5,
          title: "Layer 2 Migration",
          description: "Move your assets to Layer 2 solutions like Arbitrum or Optimism for lower fees and faster transactions.",
          potential: "High",
          risk: "Low"
        }
      ]
    },
    {
      id: 2,
      name: "Eclipse",
      avatar: "🌙",
      color: "from-green-400 to-blue-500",
      tasks: [
        {
          id: 1,
          title: "Eclipse Testnet Participation",
          description: "Join the Eclipse testnet and help test the SVM-based Layer 2 solution built on Ethereum.",
          potential: "Very High",
          risk: "Low"
        },
        {
          id: 2,
          title: "Bridge Assets",
          description: "Use the Eclipse bridge to move assets between Ethereum and Eclipse network.",
          potential: "High",
          risk: "Medium"
        },
        {
          id: 3,
          title: "Solana VM Testing",
          description: "Deploy and test Solana programs on Eclipse's Solana Virtual Machine implementation.",
          potential: "High",
          risk: "Low"
        }
      ]
    },
    {
      id: 3,
      name: "Hyperlane",
      avatar: "🚀",
      color: "from-purple-500 to-pink-500",
      tasks: [
        {
          id: 1,
          title: "Cross-Chain Messaging",
          description: "Use Hyperlane's permissionless interoperability protocol to send messages across different blockchains.",
          potential: "Very High",
          risk: "Medium"
        },
        {
          id: 2,
          title: "Deploy Hyperlane App",
          description: "Build and deploy your own cross-chain application using Hyperlane's SDK and tools.",
          potential: "High",
          risk: "Medium"
        }
      ]
    },
    {
      id: 4,
      name: "Looping",
      avatar: "♾️",
      color: "from-cyan-400 to-blue-600",
      tasks: [
        {
          id: 1,
          title: "Loop Protocol Testing",
          description: "Test the Loop protocol's yield optimization strategies and automated position management.",
          potential: "High",
          risk: "Medium"
        }
      ]
    },
    {
      id: 5,
      name: "Zora",
      avatar: "⚡",
      color: "from-blue-400 to-cyan-300",
      tasks: [
        {
          id: 1,
          title: "Create on Zora",
          description: "Mint and sell your creative works on Zora's decentralized marketplace for digital creations.",
          potential: "Medium",
          risk: "Low"
        },
        {
          id: 2,
          title: "Zora Network Usage",
          description: "Use Zora Network for low-cost NFT creation and trading with optimized gas fees.",
          potential: "High",
          risk: "Low"
        }
      ]
    },
    {
      id: 6,
      name: "Arbitrum",
      avatar: "🔹",
      color: "from-blue-600 to-purple-700",
      tasks: [
        {
          id: 1,
          title: "Arbitrum DeFi",
          description: "Explore DeFi protocols on Arbitrum One for faster and cheaper transactions than Ethereum mainnet.",
          potential: "High",
          risk: "Low"
        },
        {
          id: 2,
          title: "Arbitrum Nova Gaming",
          description: "Participate in gaming and social applications built on Arbitrum Nova for ultra-low costs.",
          potential: "Medium",
          risk: "Low"
        }
      ]
    }
  ], []);

  return (
    <div className="min-h-screen bg-black text-white flex w-full flex-col">
      {/* Expert Analysis Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm opacity-80 mb-2">EXPERT ANALYSIS</p>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Gain Insights and Make Smarter Decisions with<br />
            Professional Recommendations
          </h2>
          <Button className="bg-black bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-20">
            Join Now →
          </Button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <div className="w-full h-full bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>

      {/* Top Recommendation Stories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Top Recommendation</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="p-2">
          <StoryCarousel stories={stories} />
        </div>
      </div>
    </div>
  );
};

export default Index;
