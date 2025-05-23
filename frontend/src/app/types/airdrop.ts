export interface Airdrop {
  id: string;
  name: string;
  logo: string;
  logoColor: 'yellow' | 'orange' | 'purple' | 'cream';
  network: 'Solana' | 'Hemi' | 'Monad';
  status: 'Free' | 'Paid';
  description?: string;
  tags?: string[];
  date?: string;
  steps?: string[];
  twitterEmbed?: string;
}
