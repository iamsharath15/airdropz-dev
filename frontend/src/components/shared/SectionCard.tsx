import React from 'react';

interface SectionCardProps {
  title: string;
  message?: string;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  message = 'No data found',
}) => {
  return (
    <div className="mb-6 md:mb-8 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-xl text-lg font-bold text-white">{title}</h2>
      </div>

      <div className="bg-[#151313]  h-50 w-full flex items-center justify-center rounded-xl py-12">
        <p className="text-white/80 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default SectionCard;
