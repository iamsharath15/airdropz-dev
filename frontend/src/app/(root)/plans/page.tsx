'use client';
import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';

type PricingPlanProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};
const MotionCard = motion(Card);

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  description,
  features,
  highlighted = false,
}) => {
  return (
    <MotionCard
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`w-full h-full flex flex-col justify-between overflow-hidden border-0 ${
        highlighted ? 'bg-[#6F2BE4] text-white' : 'bg-white'
      }`}
    >
      <CardHeader className="pt-6 px-6">
        <div className="flex items-center gap-1">
          {highlighted ? (
            <Image
              src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/static-image-v1/plans/airdropz-plan-light.png"
              alt="logo"
              width={150}
              height={100}
            />
          ) : (
            <Image
              src="https://airdropzofficial-static-v1.s3.ap-south-1.amazonaws.com/static-image-v1/plans/airdropz-plan-dark.png"
              alt="logo"
              width={150}
              height={100}
            />
          )}
        </div>
        <h3 className="text-xl font-semibold mt-2">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </CardHeader>

      <CardContent className="px-6 pb-6 flex flex-col flex-grow">
        <div className="flex items-baseline mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="ml-1 text-sm opacity-80">/per month</span>
        </div>

        <Button
          variant={highlighted ? 'outline' : 'default'}
          className={`w-full mt-6 rounded-md cursor-pointer p-5 ${
            highlighted
              ? 'bg-white text-purple-600 hover:bg-gray-100'
              : 'bg-[#6F2BE4] text-white hover:bg-purple-700'
          }`}
        >
          Get Started
        </Button>

        <div className="mt-8">
          <h4 className="font-semibold mb-4">Features</h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="mr-2 h-5 w-5 min-w-5 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </MotionCard>
  );
};

const Pricing: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  flex items-center justify-center flex-col ">
          <div className="md:w-6/12 w-8/12 text-center space-y-6 py-[10%]">
            <h2 className="text-white font-semibold lg:text-5xl md:text-3xl sm:text-xl">
              Plans for Your Need
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Upgrade to Premium for an unparalleled airdrop experience. Gain
              access to a private Telegram channel, exclusive airdrops, and
              optimized fund strategies. Elevate your opportunities today.
            </p>
          </div>

          {/* FLEX Layout Instead of Grid */}
          <div className="flex flex-col md:flex-row gap-y-8 md:gap-y-0 md:gap-x-8 pb-[10%]">
            <div className="flex-1 h-full">
              <PricingPlan
                title="Free"
                price="0"
                description="Best for Beginners."
                features={[
                  'Dashboard',
                  'Task management',
                  'Check list',
                  'Basic Notification',
                  'Basic Airdrops Insight',
                ]}
              />
            </div>

            <div className="flex-1 h-full">
              <PricingPlan
                title="Pro"
                price="10"
                description="Best For Airdrops Hunters."
                features={[
                  'Advanced Dashboard',
                  'Advanced Check list',
                  'Advanced Notification',
                  'Version control',
                  'Dedicated support',
                  'Top Airdrops Insight',
                ]}
                highlighted
              />
            </div>

            <div className="flex-1 h-full">
              <PricingPlan
                title="Premium"
                price="20"
                description="Best for Crypto Experts."
                features={[
                  'Expert Analysis',
                  'Task Remainders',
                  'Exclusive community Access',
                  'Advanced Notification & Remainders',
                  'Premium Airdrops Insight',
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
