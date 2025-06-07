import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  subLabel?: string;
}

interface WelcomeCardProps {
  name: string; // "User 1" or "Admin"
  stats: StatItem[];
  color?: string; // Optional background color
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  name,
  stats,
  color = '#8373EE',
}) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="bg-[#151313] border-none mb-6 md:mb-8">
      <CardContent className="p-4 md:p-8 flex flex-col items-center">
        <div className="text-center mb-4">
          <p className="text-white">{formattedDate}</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white">
            Welcome, {name}
          </h1>
        </div>

        <div
          className="flex flex-col md:flex-row gap-4 w-full max-w-xl rounded-xl px-4 py-3 justify-center"
          style={{ backgroundColor: color }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center md:text-left ${
                i < stats.length - 1
                  ? 'border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-4 border-white'
                  : ''
              }`}
            >
              <span className="text-white font-bold">
                {stat.value}{' '}
                {stat.label && (
                  <span className="text-sm text-white">{stat.label}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
