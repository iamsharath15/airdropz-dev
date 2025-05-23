'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold">AirdropZ</span>
              <div className="h-6 w-6 rounded-full bg-yellow-400 ml-1 flex items-center justify-center">
                <span className="font-bold">Z</span>
              </div>
            </div>
            <p className="text-sm md:text-base">
              Explore the future of crypto rewards with Airdropz. Access top airdrops, follow expert strategies, and maximize your gains with every opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Link</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#8373EE]">Home</Link></li>
              <li><Link href="/airdrops" className="hover:text-[#8373EE]">Airdropz</Link></li>
              <li><Link href="/plans" className="hover:text-[#8373EE]">Pricing</Link></li>
              <li><Link href="/partners" className="hover:text-[#8373EE]">Partners</Link></li>
              <li><Link href="/faq" className="hover:text-[#8373EE]">Faq</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:text-[#8373EE]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#8373EE]">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact us</h3>
            <p className="text-sm md:text-base">
              For any kind of help & support, please write us at:
            </p>
            <div className="inline-block bg-zinc-800 rounded-full px-4 py-2">
              <a href="mailto:info@airdropz.app" className="hover:text-[#8373EE] transition-colors">
                info@airdropz.app
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section with social icons + tooltip */}
        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">©2025 AirdropZ. All rights reserved.</p>
          <TooltipProvider>
            <div className="flex space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8373EE]">
                    <Instagram size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent >Instagram</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8373EE]">
                    <Youtube size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>YouTube</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8373EE]">
                    <Twitter size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Twitter</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#8373EE]">
                    <Linkedin size={20} />
                  </a>
                </TooltipTrigger>
                <TooltipContent>LinkedIn</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
