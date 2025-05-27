'use client';

import React, { useState } from 'react';
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

  return (
    <div className="text-white flex flex-col items-start  rounded-2xl bg-[#151313] p-6 shadow-sm">
      {/* Tabs navigation */}
      <nav
        className="flex overflow-x-auto space-x-4 border-b border-gray-700 w-full "
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
            aria-current={activeTab === tab ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Settings content */}
      <div className="md:w-5/12 w-10/12 flex justify-center mt-6">
        {activeTab === 'Account' && (
          <SettingSection title="Account Settings">
            <div className="space-y-6 w-full">
              <div>
                <Label htmlFor="username" className="text-white mb-4 block">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="user1"
                  className=" border-0 text-black placeholder:text-black bg-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white mb-4 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  className=" border-0 text-black placeholder:text-black bg-white"
                />
              </div>
              <div className="flex justify-start">
                <Button
                  variant="default"
                  className="bg-[#8373EE] hover:bg-[#8373EE]/80 cursor-pointer"
                >
                  Save Changes
                </Button>
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
                defaultChecked
              />
              <NotificationToggle
                title="Weekly Reports"
                description="Receive weekly summary of your airdrop activities"
              />
              <NotificationToggle
                title="Task Reminders"
                description="Get reminders for incomplete weekly tasks"
                defaultChecked
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
                <Select defaultValue="light">
                  <SelectTrigger
                    id="theme"
                    className="bg-white border-gray-800 text-black w-full"
                  >
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                    <SelectItem value="light">Light Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className="text-white/80 pb-4 block">
                  Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger
                    id="language"
                    className="bg-white border-gray-800 text-black w-full"
                  >
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
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
                  id="email"
                  type="email"
                  placeholder="0x1a2...3b4c"
                  className=" border-0 text-black placeholder:text-black bg-white py-4"
                />
              </div>
              <div>
                <Button
                  variant="default"
                  className="bg-red-500 hover:bg-red-400 cursor-pointer"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </SettingSection>
        )}
      </div>
    </div>
  );
};

interface NotificationToggleProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  title,
  description,
  defaultChecked = false,
}) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex justify-between items-center max-w-md">
      <div className="pr-4">
        <h3 className="text-white font-semibold pb-2">{title}</h3>
        <p className="text-white/80 text-sm">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        className="peer bg-gray-700 peer-checked:bg-[#8373EE] cursor-pointer"
      />
    </div>
  );
};

export default Settings;
