"use client";

import { useMemo } from "react";
import StoryCarousel from "./StoryCarousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define TypeScript interfaces
interface Task {
  id: number;
  image: string;
  link: string;
}

interface Story {
  cover_id: number;
  cover_name: string;
  cover_image: string;
  stories: Task[];
}

const Index = () => {
  // Memoize stories to avoid recalculating on every render
  const stories: Story[] = useMemo(() => [
    {
      cover_id: 1,
      cover_name: "Ethereum",
      cover_image: "https://cdn.lootcrate.me/demo/airdropzimage.png",
      stories: [
        {
          id: 1,
          image: "https://cdn.lootcrate.me/demo/airdropzimage.png",
          link: "Low"
        },
         {
          id: 2,
          image: "https://cdn.lootcrate.me/demo/airdropzimage.png",
          link: "Low"
        },
          {
          id: 3,
          image: "https://cdn.lootcrate.me/demo/airdropzimage.png",
          link: "Low"
        },
           {
          id: 4,
          image: "https://cdn.lootcrate.me/demo/airdropzimage.png",
          link: "Low"
        },
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
