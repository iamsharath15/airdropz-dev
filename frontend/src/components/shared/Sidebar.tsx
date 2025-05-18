"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Home,
  Gift,
  ClipboardCheck,
  Star,
  Users,
  Settings,
  Menu,
  Bitcoin,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "Airdrops", icon: Gift },
  { label: "Weekly Task", icon: ClipboardCheck },
  { label: "Expert Recommendation", icon: Star },
  { label: "Refer & earn", icon: Users },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "bg-[#0d0d0d] border-r border-gray-800 p-4 flex flex-col justify-between transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="mb-6 text-white"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu />
        </Button>

        {/* Nav Items */}
        <nav className="space-y-2">
          {navItems.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              variant="ghost"
              className="w-full justify-start gap-3 text-white hover:bg-[#1a1a1a]"
            >
              <Icon size={18} />
              {!isCollapsed && <span>{label}</span>}
            </Button>
          ))}
        </nav>
      </div>

      {/* Telegram CTA */}
      {!isCollapsed && (
        <div className="mt-6 bg-[#1a1a2e] p-4 rounded-xl text-center">
          <div className="flex justify-center mb-2">
            <Bitcoin className="text-orange-400" />
          </div>
          <p className="text-xs text-gray-400 mb-2">
            Join our Telegram community for airdrop updates
          </p>
          <Button className="w-full text-black bg-white text-xs font-medium">
            Join Telegram
          </Button>
        </div>
      )}
    </aside>
  );
}
