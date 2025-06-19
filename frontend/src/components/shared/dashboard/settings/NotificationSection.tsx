import React from 'react';
import NotificationToggle from './NotificationToggle';
import { NotificationSectionProps } from '@/types';

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  newAirdropAlerts,
  setNewAirdropAlerts,
  weeklyReports,
  setWeeklyReports,
  taskReminders,
  setTaskReminders,
}) => {
  return (
    <section className="py-6 px-2 mb-6 w-full">
      <h2 className="text-xl font-semibold text-gray-200 mb-5">{title}</h2>
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
    </section>
  );
};

export default NotificationSection;
