'use client';

import { Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TelegramJoinCard() {
  return (
    <div className="relative bg-[#141522] rounded-2xl px-4 md:py-6 py-3 text-center  shadow-lg">
      <div className="overflow-hidden absolute h-full w-full top-0 left-0 rounded-2xl">
        <div className="absolute -top-12 -left-15 w-30 h-30 bg-[#ffffff61] rounded-full opacity-30  pointer-events-none" />
        <div className="absolute -bottom-16 -right-15 w-35 h-35 bg-[#ffffff61] z-10 rounded-full opacity-30 pointer-events-none" />
      </div>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FF9900] w-12 h-12 rounded-full flex items-center justify-center shadow-md z-10">
        <Bitcoin className="text-white w-8 h-8" />
      </div>

      <div className="flex flex-col items-center justify-center z-50 relative">
        <h3 className="mt-8 text-white text-base font-semibold">
          Join channel
        </h3>
        <p className="text-sm text-white/80 mt-1 mb-4">
          Join our Telegram community for airdrop updates
        </p>
               <a
          href="https://t.me/telegram"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[240px]"
        >
          <Button className="w-full bg-white hover:bg-white/80 text-black text-sm font-semibold rounded-md cursor-pointer">
            Join Telegram
          </Button>
        </a>

      </div>
    </div>
  );
}
