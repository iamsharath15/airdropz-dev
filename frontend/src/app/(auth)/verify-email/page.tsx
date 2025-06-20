// done v1
'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import OtpInput from '@/components/shared/auth/OtpInput';
import AuthSlider from '@/components/shared/auth/AuthSlider';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP sent to your email.');
      return;
    }

    try {
      setIsVerifying(true);
      const response = await axios.post(
        'http://localhost:8080/api/auth/v1/verify-email',
        {
          code: otp,
          email,
        }
      );

      toast.success(response.data.message || 'Email verified successfully!');
      router.push('/login');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || 'Verification failed.';
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      const response = await axios.post(
        'http://localhost:8080/api/auth/v1/resend-otp',
        {
          email,
        }
      );
      toast.success(response.data.message || 'OTP resent successfully!');
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const msg = err.response?.data?.message || 'Failed to resend OTP.';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex w-full h-screen">
        {/* Left - Sign In */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#8373EE] text-white px-6">
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl p-6 sm:p-8 shadow-lg text-black space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Verify Your Email</h1>
              <p className="text-sm mt-2">
                We’ve sent a 6-digit OTP to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <OtpInput length={6} onChange={setOtp} />
              <Button
                type="submit"
                className="w-full py-4 font-semibold text-sm cursor-pointer"
                disabled={isVerifying}
                aria-label="Verify Email Button"
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            <div className="text-sm text-center">
              Didn’t receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-600 underline cursor-pointer"
                disabled={isResending}
                aria-label="Resend OTP"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          </div>
        </div>
        {/* Right - Slider */}
        <AuthSlider />
      </div>
    </>
  );
}
