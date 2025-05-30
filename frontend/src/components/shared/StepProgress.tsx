// components/StepProgress.tsx
import React from 'react';

const StepProgress = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full bg-purple-50 h-1 overflow-hidden rounded-[2px]">
      <div
        className="h-1 bg-gradient-to-r from-purple-500/85 to-purple-700 transition-all duration-300 rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default StepProgress;
