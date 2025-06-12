// done v1

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { MultiStepForm } from './multi-step-form';
type StepComponentProps = {
  selectedValues: string[];
  onToggle: (val: string) => void;
};

// Step components
function UsernameStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.user_name || 'User';

  return (
    <Input
      placeholder={userName}
      className="bg-[#2A2A2A] border border-[#2a2a2a] h-12 rounded-md text-white placeholder:text-white/80 focus-visible:border-[#8373EE] focus-visible:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

type SelectButtonsProps = {
  options: string[];
  selectedValues: string[];
  onToggle: (val: string) => void;
};

function SelectButtons({
  options,
  selectedValues,
  onToggle,
}: SelectButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        return (
          <Button
            key={option}
            variant={isSelected ? 'default' : 'outline'}
            className={`h-12 w-3/12 border-none cursor-pointer hover:bg-[#8373EE] hover:text-white ${
              isSelected ? 'bg-[#8373EE] text-white ' : 'bg-[#222] text-white'
            }`}
            onClick={() => {
              console.log('Clicked:', option);
              onToggle(option);
            }}
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
}

function WalletAddressStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Input
      placeholder="Wallet address"
      className="bg-[#2A2A2A] border border-[#2a2a2a] h-12 rounded-md text-white placeholder:text-white/80 focus-visible:border-[#8373EE] focus-visible:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default function OnboardingForm() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  const userName = user?.user_name || 'User';

  const onboardingMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      userName: string;
      heardFrom: string;
      interests: string;
      experienceLevel: string;
      walletAddress: string;
    }) => {
      const res = await axios.post(
        'http://localhost:8080/api/onboarding/v1',
        data,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Onboarding complete!');
      router.push(
        user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user'
      );
    },
    onError: (err) => {
      console.error('Onboarding Error:', err);
      toast.error('Something went wrong. Please try again.');
    },
  });

  const handleComplete = (data: Record<string, string[]>) => {
    if (!userId) {
      toast.error('User not logged in');
      return;
    }

    const payload = {
      userId: String(userId),
      userName: data.step_0?.[0] || userName,
      heardFrom: data.step_1?.join(', ') || '',
      interests: data.step_2?.join(', ') || '',
      experienceLevel: data.step_3?.[0] || '',
      walletAddress: data.step_4?.[0] || '',
    };

    onboardingMutation.mutate(payload);
  };

  const steps = [
    {
      title: 'What should we call you?',
      description: 'Enter your username',
      isMultiSelect: false,
      component: (props: StepComponentProps) => (
        <UsernameStep
          value={props.selectedValues[0] || ''}
          onChange={(val) => props.onToggle(val)}
        />
      ),
    },
    {
      title: 'How did you hear about Airdropz?',
      description: '',
      isMultiSelect: true,
      component: (props: StepComponentProps) => (
        <SelectButtons
          options={[
            'Telegram',
            'Discord',
            'Twitter',
            'Instagram',
            'Facebook',
            'Others',
          ]}
          selectedValues={props.selectedValues}
          onToggle={props.onToggle}
        />
      ),
    },
    {
      title: 'What are you most interested in?',
      description: '',
      isMultiSelect: true,
      component: (props: StepComponentProps) => (
        <SelectButtons
          options={[
            'NFT drops',
            'Crypto',
            'Upcoming',
            'Tokens',
            'Early access',
            'Others',
          ]}
          selectedValues={props.selectedValues}
          onToggle={props.onToggle}
        />
      ),
    },
    {
      title: "What's your crypto experience level?",
      description: '',
      isMultiSelect: false,
      component: (props: StepComponentProps) => (
        <SelectButtons
          options={['Beginner', 'Intermediate', 'Expert']}
          selectedValues={props.selectedValues}
          onToggle={props.onToggle}
        />
      ),
    },
    {
      title: 'Connect your wallet',
      description: 'Enter your wallet id',
      isMultiSelect: false,
      component: (props: StepComponentProps) => (
        <WalletAddressStep
          value={props.selectedValues[0] || ''}
          onChange={(val) => props.onToggle(val)}
        />
      ),
    },
  ];

  return <MultiStepForm steps={steps} onComplete={handleComplete} />;
}
