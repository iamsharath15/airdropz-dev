import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletSectionProps } from '@/types';
import React from 'react';

const WalletSection: React.FC<WalletSectionProps> = ({
  title,
  wallet,
  setWallet,
}) => {
  return (
    <section className="py-6 px-2 mb-6 w-full">
      <h2 className="text-xl font-semibold text-gray-200 mb-5">{title}</h2>
      <div className="space-y-6 max-w-md">
        <div>
          <Label className="text-white/80 pb-4 block">Connected Wallet</Label>
          <Input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="border-0 text-black placeholder:text-black bg-white py-4"
          />
        </div>
        <div>
          <Button className="bg-red-500 hover:bg-red-400 cursor-pointer">
            Disconnect
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WalletSection;
