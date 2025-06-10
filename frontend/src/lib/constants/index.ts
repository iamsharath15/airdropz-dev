export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'Airdropz – Discover. Complete. Earn.';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Airdropz is your go-to platform for finding and claiming the latest Web3 airdrops. Explore trending opportunities, complete tasks, and earn crypto rewards with ease. Be early. Be rewarded.';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const faqData = [
  {
    id: 'get-started',
    title: 'Get started',
    description: 'Learn the basics',
    articles: [
      {
        slug: 'what-is-crypto-airdrop',
        question: 'What is a crypto airdrop?',
        answer: `
A crypto airdrop is a way for blockchain projects to distribute free tokens or coins to users...
        
**How to View Airdrops in the Dashboard**
1. Log In – Sign in to your account.
2. Go to Dashboard...
3. Click on “My Airdrops”...
A crypto airdrop is a way to distribute free tokens.\n\n### How to Claim\n\n1. Log in\n2. Visit **Dashboard**\n\n![Airdrop](https://example.com/airdrop.png)
        `,
      },
      {
        slug: 'how-to-participate',
        question: 'How can I participate in an airdrop?',
        answer:
          'You can participate by connecting a wallet and completing tasks...',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Issues',
    articles: [
      {
        slug: 'not-receiving-airdrop',
        question: 'Why didn’t I receive my airdrop?',
        answer: 'Check your wallet address and task status.',
      },
    ],
  },
  {
    id: 'troubles',
    title: 'Troubleshooting',
    description: 'Issues',
    articles: [
      {
        slug: 'not-receiving-airdrop',
        question: 'Why didn’t I receive my airdrop?',
        answer: 'Check your wallet address and task status.',
      },
    ],
  },
  {
    id: 'get-starteds',
    title: 'Get started',
    description: 'Learn the basics',
    articles: [
      {
        slug: 'what-is-crypto-airdrop',
        question: 'What is a crypto airdrop?',
        answer: `
A crypto airdrop is a way for blockchain projects to distribute free tokens or coins to users...
        
**How to View Airdrops in the Dashboard**
1. Log In – Sign in to your account.
2. Go to Dashboard...
3. Click on “My Airdrops”...
A crypto airdrop is a way to distribute free tokens.\n\n### How to Claim\n\n1. Log in\n2. Visit **Dashboard**\n\n![Airdrop](https://example.com/airdrop.png)
        `,
      },
      {
        slug: 'how-to-participate',
        question: 'How can I participate in an airdrop?',
        answer:
          'You can participate by connecting a wallet and completing tasks...',
      },
    ],
  },
  {
    id: 'troubleshootings',
    title: 'Troubleshooting',
    description: 'Issues',
    articles: [
      {
        slug: 'not-receiving-airdrop',
        question: 'Why didn’t I receive my airdrop?',
        answer: 'Check your wallet address and task status.',
      },
    ],
  },
  {
    id: 'troubless',
    title: 'Troubleshooting',
    description: 'Issues',
    articles: [
      {
        slug: 'not-receiving-airdrop',
        question: 'Why didn’t I receive my airdrop?',
        answer: 'Check your wallet address and task status.',
      },
    ],
  },
];

export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  // any other fields that partnersData has
}

export const partnersData: Partner[] = [
  {
    id: '1',
    name: 'Makeo',
    logo: 'https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c133c1cee43d6f61df2dce_MAKEO.svg',
    description:
      'Makeo supports Web3 adoption by offering easy KYC integrations for token airdrops and NFT campaigns.',
  },
  {
    id: '2',
    name: 'Doobank',
    logo: 'https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c13347d9d1fe0f646887d2_Doobank.svg',
    description:
      'Doobank bridges DeFi to CeFi — enabling fast fiat off-ramps and reward claims for airdrop hunters worldwide.',
  },
  {
    id: '3',
    name: 'Onebit',
    logo: 'https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c132b4659381aa61d6c48f_onebit.svg',
    description:
      'Onebit Wallet offers secure, gasless claiming for token airdrops with multi-chain support.',
  },
  {
    id: '4',
    name: 'BeSound',
    logo: 'https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c1320ac6cd4b922782e97b_BeSound.svg',
    description:
      'BeSound collaborates with Web3 creators to launch music-based NFT airdrops and exclusive listener rewards.',
  },
  {
    id: '5',
    name: 'Braintech',
    logo: 'https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c12fb90ccd6781d9d2138b_braintech.svg',
    description:
      'Braintech uses AI to rank and vet upcoming airdrops, helping users discover legit and high-potential drops.',
  },
];


export const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Settings', href: '/admin/settings' },
];

export const userNavItems = [
  { label: 'Dashboard', href: '/user/dashboard' },
  { label: 'Airdrops', href: '/user/airdrops' },
  { label: 'Settings', href: '/user/settings' },
];
