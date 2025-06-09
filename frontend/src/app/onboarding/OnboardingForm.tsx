'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MultiStepForm } from "./multi-step-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from '@/store';  // update path to your store

import axios from "axios";
 
type StepValues = {
  step_0: string[];
  step_1: string[];
  step_2: string[];
  step_3: string[];
  step_4: string[];
};
// Wrapper for step 0: username input (no selectedValues)
function UsernameStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
  }) {
   const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.username || 'User';
  return (
    <Input
      placeholder={userName}
      className="bg-[#2A2A2A] border border-[#2a2a2a] h-12 rounded-md text-white placeholder:text-white/80 focus-visible:border-[#8373EE] focus-visible:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// Wrapper for steps with multiple select buttons
function SelectButtons({
  options,
  selectedValues,
  onToggle
}: {
  options: string[];
  selectedValues: string[];
    onToggle: (val: string) => void;
    isMultiSelect?: boolean;

}) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((text) => {
        const isSelected = selectedValues.includes(text);
        return (
          <Button
            key={text}
            variant={isSelected ? "default" : "outline"}
            className={`h-12 border-none w-3/12 cursor-pointer ${
              isSelected
                ? "bg-[#8373EE] text-white hover:bg-[#8373EE]"
                : "bg-[#222222] text-white hover:bg-[#8373EE] hover:text-white"
            }`}
            onClick={() => onToggle(text)}
          >
            {text}
          </Button>
        );
      })}
    </div>
  );
}

// Wrapper for step 4: wallet address input
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
  const userName = user?.username || 'User';


  // We'll keep the form state here per step, because MultiStepForm does not manage it internally
  const [stepValues, setStepValues] = useState<StepValues>({
    step_0: [""], // username as array for consistency
    step_1: [], // heardFrom multi-select
    step_2: [], // interests multi-select
    step_3: [""], // experienceLevel single-select
    step_4: [""], // walletAddress
  });

  // Toggle function for multi-select steps
  const toggleValue = (stepKey: string, val: string) => {
    setStepValues((prev) => {
      const selected = prev[stepKey] || [];
      let updated;
      if (selected.includes(val)) {
        updated = selected.filter((v: string) => v !== val);
      } else {
        updated = [...selected, val];
      }
      return { ...prev, [stepKey]: updated };
    });
  };

  // Set value for single-input steps
  const setValue = (stepKey: string, val: string) => {
    setStepValues((prev) => ({ ...prev, [stepKey]: [val] }));
  };

  const onboardingMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      username: string;
      heardFrom: string;
      interests: string;
      experienceLevel: string;
      walletAddress: string;
    }) => {
      const res = await axios.post("http://localhost:8080/api/onboarding/v1", data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Onboarding complete!");
        if (user?.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
    },
    onError: (err) => {
      console.error("Onboarding Error:", err);
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleComplete = () => {
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    const payload = {
      userId,
      username: stepValues.step_0?.[0] || userName,
      heardFrom: stepValues.step_1?.join(", ") || "",
      interests: stepValues.step_2?.join(", ") || "",
      experienceLevel: stepValues.step_3?.[0] || "",
      walletAddress: stepValues.step_4?.[0] || "",
    };

    onboardingMutation.mutate(payload);
  };

  const steps = [
    {
      title: "What should we call you?",
      description: "Enter your username",
      isMultiSelect: false,
      component: (
        <UsernameStep
          value={stepValues.step_0[0]}
          onChange={(val) => setValue("step_0", val)}
        />
      ),
    },
    {
      title: "How did you hear about Airdropz?",
      description: "",
      isMultiSelect: true,
      component: (
        <SelectButtons
          options={["Telegram", "Discord", "Twitter", "Instagram", "Facebook", "Others"]}
          selectedValues={stepValues.step_1}
          onToggle={(val) => toggleValue("step_1", val)}
        />
      ),
    },
    {
      title: "What are you most interested in?",
      description: "",
      isMultiSelect: true,
      component: (
        <SelectButtons
          options={["NFT drops", "Crypto", "Upcoming", "Tokens", "Early access", "Others"]}
          selectedValues={stepValues.step_2}
          onToggle={(val) => toggleValue("step_2", val)}
        />
      ),
    },
    {
      title: "What's your crypto experience level?",
      description: "",
      isMultiSelect: false,
      component: (
        <SelectButtons
          options={["Beginner", "Intermediate", "Expert"]}
          selectedValues={stepValues.step_3}
          onToggle={(val) => setValue("step_3", val)}
        />
      ),
    },
    {
      title: "Connect your wallet",
      description: "Enter your wallet id",
      isMultiSelect: false,
      component: (
        <WalletAddressStep
          value={stepValues.step_4[0]}
          onChange={(val) => setValue("step_4", val)}
        />
      ),
    },
  ];

  return <MultiStepForm steps={steps} onComplete={handleComplete} />;
}
