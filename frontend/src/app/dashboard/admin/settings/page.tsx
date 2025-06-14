'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import Image from 'next/image';
import { uploadImageToS3 } from '@/lib/uploadToS3';

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

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
  <section className="py-6 px-2 mb-6 w-full">
    <h2 className="text-xl font-semibold text-gray-200 mb-5">{title}</h2>
    {children}
  </section>
);

const TABS = ['Account', 'Notification', 'Display', 'Wallet'] as const;
type Tab = (typeof TABS)[number];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Account');
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'user1';
  const userEmail = user?.email || 'user@example.com';
  const walletAddress = user?.wallet_address || 'add your wallet';

  // Local state for form data
  const [username, setUsername] = useState(userName);
  const [wallet, setWallet] = useState(walletAddress);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const [newAirdropAlerts, setNewAirdropAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/settings/v1/', {
          withCredentials: true,
        });

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
      const response = await axios.patch(
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
        {
          withCredentials: true,
        }
      );

      console.log('Settings updated:', response.data);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
 if (isLoading) {
    return <div className="text-white p-6">Loading settings...</div>;
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
                  <SelectTrigger
                    id="theme"
                    className="bg-white border-gray-800 text-black w-full"
                  >
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
                  <SelectTrigger
                    id="language"
                    className="bg-white border-gray-800 text-black w-full"
                  >
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
            className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface NotificationToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  description,
  checked,
  onChange,
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

interface ProfilePictureUploadProps {
  userId: string;
  userName: string;
  setProfileImageUrl: (url: string) => void;
  profileImageUrl:string;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  userId,
  userName,
  setProfileImageUrl,
  profileImageUrl
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
      console.log('Uploaded to S3:', url);
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
      src={previewUrl || profileImageUrl!}
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
