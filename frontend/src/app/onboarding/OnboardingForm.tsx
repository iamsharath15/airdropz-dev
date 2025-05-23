'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MultiStepForm } from "./multi-step-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SelectButtonsProps = {
  selectedValues: string[];
  onToggle: (value: string) => void;
};

function SelectButtons({ options, selectedValues, onToggle }: { options: string[]; selectedValues: string[]; onToggle: (val: string) => void }) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map(text => {
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

export default function OnboardingForm() {
  const router = useRouter();

  const handleComplete = (data: Record<string, any>) => {
    console.log("Onboarding complete with data:", data);
    toast.success("Onboarding complete!");
    router.push("/dashboard");
  };

  const steps = [
    {
      title: "What should we call you?",
      description: "Enter your username",
      component: (
   <Input
  placeholder="Username"
  className="bg-[#2A2A2A] border border-[#2a2a2a] h-12 rounded-md text-white placeholder:text-white/80 focus-visible:border-[#8373EE] focus-visible:outline-none"
/>


      )
    },
    {
      title: "How did you hear about Airdropz?",
      description: "",
      isMultiSelect: true,
      component: (
        <SelectButtons
          options={["Telegram", "Discord", "Twitter/X", "Instagram", "Facebook", "Others"]}
          selectedValues={[]}  // these will be overridden by MultiStepForm
          onToggle={() => {}}   // overridden too
        />
      )
    },
    {
      title: "What are you most interested in?",
      description: "",
      isMultiSelect: true,
      component: (
        <SelectButtons
          options={["NFT drops", "Crypto", "Upcoming", "Tokens", "Early access", "Others"]}
          selectedValues={[]}
          onToggle={() => {}}
        />
      )
    },
    {
      title: "What's your crypto experience level?",
      description: "",
      isMultiSelect: false,  // single select
      component: (
        <SelectButtons
          options={["Beginner", "Intermediate", "Expert"]}
          selectedValues={[]}
          onToggle={() => {}}
        />
      )
    },
    {
      title: "Connect your wallet",
      description: "Enter your wallet id",
      component: (
        <Input
          placeholder="Wallet address"
  className="bg-[#2A2A2A] border border-[#2a2a2a] h-12 rounded-md text-white placeholder:text-white/80 focus-visible:border-[#8373EE] focus-visible:outline-none"
        />
      )
    }
  ];

  return <MultiStepForm steps={steps} onComplete={handleComplete} />;
}
