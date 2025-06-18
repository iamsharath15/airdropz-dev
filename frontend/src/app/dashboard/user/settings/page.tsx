'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import Image from 'next/image';
import { uploadImageToS3 } from '@/lib/uploadToS3';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { toast } from 'sonner';
import { updateUser } from '@/store/authSlice';
import { useRoleRedirect } from '@/lib/useRoleRedirect';
import type { SettingSectionProps } from '@/types';

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
  <section className="py-6 px-2 mb-6 w-full">
    <h2 className="text-xl font-semibold text-gray-200 mb-5">{title}</h2>
    {children}
  </section>
);

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

const Settings: React.FC = () => {
  useRoleRedirect('user');
  const [activeTab, setActiveTab] = useState<Tab>('Account');
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'user1';
  const userEmail = user?.email || 'user@example.com';
  const walletAddress = user?.wallet_address || 'add your wallet';

  const [username, setUsername] = useState(userName);
  const [wallet, setWallet] = useState(walletAddress);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const [newAirdropAlerts, setNewAirdropAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/settings/v1/',
          { withCredentials: true }
        );
        const settings = response.data;
        setUsername(settings.user_name || '');
        setWallet(settings.wallet_address || '');
        setProfileImageUrl(settings.profile_image || null);
        setNewAirdropAlerts(settings.new_airdrop_alerts ?? true);
        setWeeklyReports(settings.weekly_reports ?? false);
        setTaskReminders(settings.task_reminders ?? true);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.patch(
        'http://localhost:8080/api/settings/v1/',
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
      );
      dispatch(
        updateUser({
          user_name: username,
          profile_image: profileImageUrl ?? undefined,
          wallet_address: wallet,
        })
      );

      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
          <SettingSection title="Account Settings">
            <div className="space-y-6 w-full">
              <ProfilePictureUpload
                userId={(user?.id ?? '').toString()}
                userName={username}
                setProfileImageUrl={setProfileImageUrl}
                profileImageUrl={profileImageUrl ?? ''}
              />
              <div>
                <Label htmlFor="username" className="text-white mb-4 block">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-0 text-black placeholder:text-black bg-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white mb-4 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  placeholder={userEmail}
                  className="border-0 text-black placeholder:text-black bg-white opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </SettingSection>
        )}

        {activeTab === 'Notification' && (
          <SettingSection title="Notification Preferences">
            <div className="space-y-6 max-w-md">
              <NotificationToggle
                title="New Airdrop Alerts"
                description="Get notified when new airdrops are available"
                checked={newAirdropAlerts}
                onChange={setNewAirdropAlerts}
              />
              <NotificationToggle
                title="Weekly Reports"
                description="Receive weekly summary of your airdrop activities"
                checked={weeklyReports}
                onChange={setWeeklyReports}
              />
              <NotificationToggle
                title="Task Reminders"
                description="Get reminders for incomplete weekly tasks"
                checked={taskReminders}
                onChange={setTaskReminders}
              />
            </div>
          </SettingSection>
        )}

        {activeTab === 'Display' && (
          <SettingSection title="Display Settings">
            <div className="space-y-6 max-w-md">
              <div>
                <Label htmlFor="theme" className="text-white/80 pb-4 block">
                  Theme
                </Label>
                <Select defaultValue="dark" disabled>
                  <SelectTrigger className="bg-white border-gray-800 text-black w-full">
                    <SelectValue placeholder="Dark Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className="text-white/80 pb-4 block">
                  Language
                </Label>
                <Select defaultValue="en" disabled>
                  <SelectTrigger className="bg-white border-gray-800 text-black w-full">
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SettingSection>
        )}

        {activeTab === 'Wallet' && (
          <SettingSection title="Wallet Settings">
            <div className="space-y-6 max-w-md">
              <div>
                <Label className="text-white/80 pb-4 block">
                  Connected Wallet
                </Label>
                <Input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="border-0 text-black placeholder:text-black bg-white py-4"
                />
              </div>
              <div>
                <Button className="bg-red-500 hover:bg-red-400 cursor-pointer">
                  Disconnect
                </Button>
              </div>
            </div>
          </SettingSection>
        )}

        <div className="flex justify-start">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer flex items-center gap-2"
          >
            {isSaving ? (
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

const NotificationToggle = ({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex justify-between items-center max-w-md">
    <div className="pr-4">
      <h3 className="text-white font-semibold pb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className="peer bg-gray-700 peer-checked:bg-[#8373EE] cursor-pointer"
    />
  </div>
);

const ProfilePictureUpload = ({
  userId,
  userName,
  setProfileImageUrl,
  profileImageUrl,
}: {
  userId: string;
  userName: string;
  setProfileImageUrl: (url: string) => void;
  profileImageUrl: string;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const initial = userName.charAt(0).toUpperCase();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const url = await uploadImageToS3(file, `profile-pictures/${userId}`);
      setProfileImageUrl(url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-4/12 rounded-full overflow-hidden flex items-center justify-center text-white text-3xl font-bold">
        {previewUrl || profileImageUrl ? (
          <Image
            width={96}
            height={96}
            src={previewUrl || profileImageUrl}
            alt="Profile"
            className="object-cover w-24 h-24 rounded-full border border-gray-500 bg-gray-700"
          />
        ) : (
          <div className="w-24 h-24 border border-gray-500 bg-gray-700 rounded-full flex items-center justify-center">
            <span>{initial}</span>
          </div>
        )}
      </div>

      <div className="w-8/12">
        <Label className="text-white block mb-1">Profile Picture</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer bg-white text-black"
        />
      </div>
    </div>
  );
};

export default Settings;
