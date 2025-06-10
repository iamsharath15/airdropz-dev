// components/StepProgress.tsx
import React from 'react';

const StepProgress = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full bg-purple-50 h-1 overflow-hidden rounded-[2px]">
      <div
        className="h-1 bg-gradient-to-r from-[#8373EE]/85 to-[#8373EE] transition-all duration-300 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default StepProgress;
