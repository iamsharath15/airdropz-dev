'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Flame, Trophy, Star, Zap, Gift } from 'lucide-react';
interface DailyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: {
    streakCount: number;
    totalLogins: number;
    todayPoints: number;
  };
}

const DailyLoginModal = ({
  isOpen,
  onClose,
  loginData,
}: DailyLoginModalProps) => {
  const getStreakBonus = () => {
    if (loginData.streakCount >= 7) return '🔥 Fire Streak!';
    if (loginData.streakCount >= 3) return '⚡ Hot Streak!';
    return '🌟 Keep Going!';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogTitle></DialogTitle>
      <DialogContent className="w-full max-w-md sm:max-w-sm md:max-w-lg bg-gray-900 border-gray-700 text-white overflow-hidden rounded-2xl p-0 max-h-[95vh] overflow-y-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-[#151313] rounded-2xl" />
          <div className="relative p-6 sm:p-8 text-center">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <div
                  className={`relative p-6 bg-[#8373EE] rounded-full shadow-2xl
                   animate-pulse
                  `}
                >
                  <Calendar className="w-10 h-10 text-white" />
                  <div className="absolute -top-2 -right-2 animate-bounce">
                    <div className="w-6 h-6 bg-[#8373EE] rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text ">
                Daily Check-in
              </h2>

              <p className="text-gray-400 text-lg">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#8373EE]/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">
                  <div className="text-2xl font-bold">
                    {loginData.streakCount}
                  </div>
                </div>
                <div className="text-xs text-white">Day Streak</div>
              </div>

              <div className="bg-[#8373EE]/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 flex-row">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {loginData.totalLogins}
                </div>
                <div className="text-xs text-white">Total Logins</div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-[#8373EE]/80 to-[#8373EE]/80 rounded-2xl border border-purple-500/30">
              <div className="text-lg font-semibold text-white mb-1">
                {getStreakBonus()}
              </div>
              <div className="text-sm text-white/90">
                Keep your streak alive for bigger rewards
              </div>
            </div>

            {loginData?.todayPoints && loginData.todayPoints > 0 ? (
              <div className="bg-green-600/20 rounded-2xl p-6 border border-green-500/30 mb-6">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-green-400 text-2xl font-bold mb-1">
                  Success!
                </div>
                <div className="text-green-300 text-lg">
                  +{loginData.todayPoints} Airdrops Earned
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  Come back tomorrow for more!
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-6">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <Gift className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="text-gray-300 text-xl font-bold mb-1">
                  Already Checked In
                </div>
                <div className="text-gray-400">
                  Your daily reward is waiting for tomorrow!
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyLoginModal;
