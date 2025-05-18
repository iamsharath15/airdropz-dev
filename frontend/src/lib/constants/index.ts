export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Airdropz – Discover. Complete. Earn.';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Airdropz is your go-to platform for finding and claiming the latest Web3 airdrops. Explore trending opportunities, complete tasks, and earn crypto rewards with ease. Be early. Be rewarded.';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'


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
];

export const partnersData = [
  {
    "name": "Makeo",
    "logo": "https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c133c1cee43d6f61df2dce_MAKEO.svg",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vel, reprehenderit tenetur culpa aliquam similique commodi quos minus doloribus praesentium!"
  },
  {
    "name": "Doobank",
    "logo": "https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c13347d9d1fe0f646887d2_Doobank.svg",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vel, reprehenderit tenetur culpa aliquam similique commodi quos minus doloribus praesentium!"
  },
  {
    "name": "Onebit",
    "logo": "https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c132b4659381aa61d6c48f_onebit.svg",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vel, reprehenderit tenetur culpa aliquam similique commodi quos minus doloribus praesentium!"
  },
  {
    "name": "BeSound",
    "logo": "https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c1320ac6cd4b922782e97b_BeSound.svg",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vel, reprehenderit tenetur culpa aliquam similique commodi quos minus doloribus praesentium!"
  },
  {
    "name": "Braintech",
    "logo": "https://assets.website-files.com/64bec233ea9c3e4f5dda1080/64c12fb90ccd6781d9d2138b_braintech.svg",
    "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut vel, reprehenderit tenetur culpa aliquam similique commodi quos minus doloribus praesentium!"
  }
  
]


export const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users", href: "/admin/users" },
  { label: "Settings", href: "/admin/settings" },
];

export const userNavItems = [
  { label: "Dashboard", href: "/user/dashboard" },
  { label: "Airdrops", href: "/user/airdrops" },
  { label: "Settings", href: "/user/settings" },
];
