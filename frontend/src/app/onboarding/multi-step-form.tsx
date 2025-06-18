// done v1

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { MultiStepFormProps } from '@/types';

export function MultiStepForm({ steps, onComplete }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, string[]>
  >({});
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleSelection = (
    stepIndex: number,
    value: string,
    multiSelect: boolean
  ) => {
    setSelectedOptions((prev) => {
      const currentSelected = prev[stepIndex] || [];
      let newSelected: string[] = [];

      if (multiSelect) {
        newSelected = currentSelected.includes(value)
          ? currentSelected.filter((v) => v !== value)
          : [...currentSelected, value];
      } else {
        newSelected = [value];
      }

      return {
        ...prev,
        [stepIndex]: newSelected,
      };
    });
  };

  const goToNextStep = () => {
    const currentSelected = selectedOptions[currentStep] || [];

    setFormData((prev) => ({
      ...prev,
      [`step_${currentStep}`]: currentSelected,
    }));

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        ...formData,
        [`step_${currentStep}`]: currentSelected,
      });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    router.push(
      user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'
    );
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md p-[5%]">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="mb-8 bg-[#222222] hover:text-white text-white border-none hover:bg-[#333333] flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Cancel
        </Button>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-400">
            STEP {currentStep + 1} OF {steps.length}
          </p>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-6">
            <div
              className="h-full bg-[#8373EE] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <h1 className="text-4xl font-bold my-8">
            {steps[currentStep].title}
          </h1>
          <p className="text-xl mb-6">{steps[currentStep].description}</p>
        </div>

        {/* Render the component function with fresh props */}
        {steps[currentStep].component({
          selectedValues: selectedOptions[currentStep] || [],
          onToggle: (val: string) =>
            toggleSelection(
              currentStep,
              val,
              steps[currentStep].isMultiSelect || false
            ),
        })}

        <div className="flex gap-4 mt-8">
          {currentStep < steps.length - 1 && (
            <Button
              onClick={goToNextStep}
              className="bg-[#8373EE] hover:bg-[#8373eeb6] text-white px-8 cursor-pointer"
            >
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              onClick={goToNextStep}
              className="bg-[#8373EE] hover:bg-[#6e59a5] text-white px-8 cursor-pointer hover:text-white"
            >
              Complete
            </Button>
          )}
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="bg-[#222222] hover:bg-[#333333] text-white border-none cursor-pointer hover:text-white"
            >
              Back
            </Button>
          )}
          {currentStep !== 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOptions((prev) => ({ ...prev, [currentStep]: [] }));
                goToNextStep();
              }}
              className="bg-[#222222] hover:bg-[#333333] text-white border-none cursor-pointer hover:text-white"
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
