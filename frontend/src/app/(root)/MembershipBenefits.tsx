'use client';

import { motion } from 'framer-motion';

const benefits = [
  {
    title: 'Unlimited Airdrops',
    description: 'Access countless airdrops without limits. Hunt, claim, and earn as much as you want.',
    icon: (
      <svg className="w-10 h-10 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5H6a2 2 0 00-2 2v12m0 0h11a2 2 0 002-2V5m0 0L9 15M15 3l6 6" />
      </svg>
    ),
  },
  {
    title: 'Verified Projects',
    description: 'Only high-quality, manually verified Web3 projects get listed on our platform.',
    icon: (
      <svg className="w-10 h-10 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: 'Early Access',
    description: 'Be the first to discover and join new airdrops before they go public.',
    icon: (
      <svg className="w-10 h-10 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11l-1-2M13 10l1 2H3m13-2h5l-2.5 3L21 18h-5l-1-2M3 18h9l-1-2H3z" />
      </svg>
    ),
  },
  {
    title: 'Boost Your Earnings',
    description: 'Complete daily and weekly tasks to multiply your rewards and climb the leaderboard.',
    icon: (
      <svg className="w-10 h-10 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l1.41 1.41L10 8.83m4 4.24l4.59-4.59L20 12m-4 4v4m-8-4v4" />
      </svg>
    ),
  },
  {
    title: 'All-in-One Dashboard',
    description: 'Track your airdrops, referral earnings, completed tasks, and streaks in one place.',
    icon: (
      <svg className="w-10 h-10 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8m0 4h8" />
      </svg>
    ),
  },
  {
    title: 'Community First',
    description: 'We’re driven by community. Enjoy support, transparency, and constant improvements.',
    icon: (
      <svg className="w-10 h-10 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4 0h8" />
      </svg>
    ),
  },
];

export default function AirdropzMembershipBenefits() {
  return (
    <section className="bg-black text-white py-20 px-4 w-full flex flex-col items-center justify-center
    " id="benefits">
      <div className="w-10/12 mx-auto text-center flex flex-col items-center justify-center">
        <div className="md:w-6/12 w-10/12">
            <h2 className="text-4xl font-bold mb-4">Why Join Airdropz?</h2>
        <p className="text-white mb-12">
          Unlock the full potential of Web3 rewards with exclusive member benefits designed to maximize your gains.
        </p>
      </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              className="bg-[#0c0c0f] p-6 rounded-2xl text-center hover:shadow-lg py-[14%] transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="flex justify-center rounded-md">{benefit.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-white">{benefit.title}</h3>
              <p className="text-sm text-white/80">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
