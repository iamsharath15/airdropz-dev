'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRoleRedirect } from '@/lib/useRoleRedirect';
import AccountSection from '@/components/shared/dashboard/settings/AccountSection';
import NotificationSection from '@/components/shared/dashboard/settings/NotificationSection';
import DisplaySection from '@/components/shared/dashboard/settings/DisplaySection';
import WalletSection from '@/components/shared/dashboard/settings/WalletSection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { setProfile } from '@/store/profileSlice';

const TABS = ['Account', 'Notification', 'Display', 'Wallet'] as const;
type Tab = (typeof TABS)[number];

const SkeletonBox = ({ className = '' }) => (
  <motion.div
    className={`bg-zinc-800 rounded-md ${className}`}
    animate={{ opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
);

const SkeletonLoader = () => (
  <div className="w-full md:w-5/12 mt-6 space-y-6">
    <SkeletonBox className="w-32 h-6" />
    <div className="flex gap-4 items-center">
      <SkeletonBox className="w-24 h-24 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="w-3/4 h-4" />
        <SkeletonBox className="w-full h-10" />
      </div>
    </div>
    <SkeletonBox className="w-1/2 h-4" />
    <SkeletonBox className="w-full h-10" />
    <SkeletonBox className="w-1/2 h-4 mt-4" />
    <SkeletonBox className="w-full h-10" />
  </div>
);

const UserSettings: React.FC = () => {
  useRoleRedirect('user');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const user = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState<Tab>('Account');

  const [username, setUsername] = useState('');
  const [wallet, setWallet] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [newAirdropAlerts, setNewAirdropAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);
  const profile = useSelector((state: RootState) => state.profile.data);

  const { isLoading } = useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/account-setting/v1/profile`,
        {
          withCredentials: true,
        }
      );
      dispatch(setProfile(res.data.data));
      return res.data.data;
    },
    enabled: !profile, // only fetch if profile doesn't exist in Redux
  });

  useEffect(() => {
    if (profile) {
      setUsername(profile.user_name || '');
      setWallet(profile.wallet_address || '');
      setProfileImageUrl(profile.profile_image || null);
      setNewAirdropAlerts(profile.new_airdrop_alerts ?? true);
      setWeeklyReports(profile.weekly_reports ?? false);
      setTaskReminders(profile.task_reminders ?? true);
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: async () =>
      axios.patch(
        `http://localhost:8080/api/account-setting/v1/profile`,
        {
          user_name: username,
          profile_image: profileImageUrl,
          wallet_address: wallet,
          new_airdrop_alerts: newAirdropAlerts,
          weekly_reports: weeklyReports,
          task_reminders: taskReminders,
          mode: 'dark',
          language: 'english',
        },
        { withCredentials: true }
      ),
    onSuccess: (res) => {
      const updatedProfile = res.data?.data;

      dispatch(setProfile(updatedProfile));

      queryClient.invalidateQueries({
        queryKey: ['user-settings'],
      });

      toast.success('Settings updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update settings. Please try again.');
    },
  });

  if (isLoading) {
    return (
      <div className="text-white flex flex-col items-start rounded-2xl bg-[#151313] p-6 shadow-sm">
        <nav
          className="flex overflow-x-auto space-x-4 border-b border-gray-700 w-full"
          aria-label="Settings Tabs"
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              className="whitespace-nowrap p-3 font-semibold border-b-4 cursor-not-allowed border-transparent text-gray-600"
              disabled
            >
              {tab}
            </button>
          ))}
        </nav>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="text-white flex flex-col items-start rounded-2xl bg-[#151313] p-6 shadow-sm">
      <nav
        className="flex overflow-x-auto space-x-4 border-b border-gray-700 w-full"
        aria-label="Settings Tabs"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap p-3 font-semibold border-b-4 cursor-pointer ${
              activeTab === tab
                ? 'border-[#8373EE] text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="md:w-5/12 w-10/12 flex flex-col justify-center mt-6">
        {activeTab === 'Account' && (
          <AccountSection
            title="Account Settings"
            userName={username}
            setUsername={setUsername}
            userEmail={user?.email || ''}
            setProfileImageUrl={setProfileImageUrl}
            profileImageUrl={profileImageUrl || ''}
            userId={user?.id || ''}
          />
        )}
        {activeTab === 'Notification' && (
          <NotificationSection
            title="Notification Preferences"
            newAirdropAlerts={newAirdropAlerts}
            setNewAirdropAlerts={setNewAirdropAlerts}
            weeklyReports={weeklyReports}
            setWeeklyReports={setWeeklyReports}
            taskReminders={taskReminders}
            setTaskReminders={setTaskReminders}
          />
        )}
        {activeTab === 'Display' && <DisplaySection title="Display Settings" />}
        {activeTab === 'Wallet' && (
          <WalletSection
            title="Wallet Settings"
            wallet={wallet}
            setWallet={setWallet}
          />
        )}

        <div className="flex justify-start mt-4">
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer flex items-center gap-2"
          >
            {mutation.isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
