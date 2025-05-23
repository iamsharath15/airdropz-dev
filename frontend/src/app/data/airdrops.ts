import { Airdrop } from '@/app/types/airdrop';

export const airdrops: Airdrop[] = [
  {
    id: '1',
    name: 'Shaga',
    logo: 'S',
    logoColor: 'yellow',
    network: 'Solana',
    status: 'Free',
    description: 'Shaga Network is building a more efficient, accessible, and globally distributed system for on-demand digital assets — aiming to revolutionize decentralized finance.',
    date: 'Apr 22, 2025',
    steps: [
      'Go to Shaga Dashboard',
      'Register with your email',
      'Use referral code: aef13bf',
      'Log in to your account',
      'Verify your email'
    ]
  },
  {
    id: '2',
    name: 'Ostium',
    logo: 'O',
    logoColor: 'orange',
    network: 'Solana',
    status: 'Paid',
    description: 'Ostium is building a cross-chain infrastructure for seamless asset transfers and decentralized applications.',
    date: 'May 5, 2025'
  },
  {
    id: '3',
    name: 'Hemi Network',
    logo: 'H',
    logoColor: 'cream',
    network: 'Hemi',
    status: 'Paid',
    description: 'Hemi Network provides a scalable Layer 2 solution with low transaction fees and high throughput for DeFi applications.'
  },
  {
    id: '4',
    name: 'Monad',
    logo: 'M',
    logoColor: 'purple',
    network: 'Monad',
    status: 'Free',
    description: 'Monad is a high-performance blockchain designed for institutional-grade financial applications with sub-second finality.'
  },
  {
    id: '5',
    name: 'Ostium Pro',
    logo: 'O',
    logoColor: 'orange',
    network: 'Solana',
    status: 'Paid',
    description: 'Ostium Pro offers advanced features for professional traders with algorithmic trading and deep liquidity pools.'
  },
  {
    id: '6',
    name: '3DOS Network',
    logo: '3D',
    logoColor: 'purple',
    network: 'Monad',
    status: 'Free',
    description: '3DOS Network is building a more efficient, accessible, and globally distributed system for on-demand physical goods production — aiming to shake up traditional manufacturing.',
    date: 'Apr 22, 2025',
    steps: [
      'Go to 3DOS Dashboard',
      'Register with your email',
      'Use referral code: aef13bf',
      'Log in to your account',
      'Verify your email'
    ],
    twitterEmbed: 'Building things has never been easier on Sui thanks to our new partnership with @3DOSNetwork, which makes access to decentralized manufacturing even easier.'
  }
];
