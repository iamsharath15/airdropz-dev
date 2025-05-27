'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

export default function OTPPage() {
  const [otp, setOtp] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 6 && /^[0-9]*$/.test(e.target.value)) {
      setOtp(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    // TODO: Call your OTP verify API here

    toast.success('OTP verified successfully!');
    // Redirect user after success if needed
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen w-full justify-center items-center bg-[#8373EE] px-6">
        <div className="max-w-sm w-full space-y-6 bg-white p-8 rounded-md shadow-md">
          <h1 className="text-3xl font-semibold text-center text-black">Enter OTP</h1>
          <p className="text-center text-sm text-gray-700">Please enter the 6-digit code sent to your email.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={handleChange}
              maxLength={6}
              className="text-center tracking-widest text-xl font-mono"
              autoFocus
              required
            />

            <Button type="submit" className="w-full py-4 font-semibold text-sm">
              Verify OTP
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
