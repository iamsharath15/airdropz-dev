// done v1
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Toaster, toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthSlider from '@/components/shared/auth/AuthSlider';
import type { ForgotPasswordResponse } from '@/types';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const { mutate: requestPasswordReset, status: requestStatus } = useMutation<
    ForgotPasswordResponse,
    AxiosError,
    string
  >({
    mutationFn: async (email) => {
      const response = await axios.post(
        'http://localhost:8080/api/auth/v1/request-password-reset',
        { email }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset link sent to your email.');
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string; error?: string };
      const message =
        data?.message || data?.error || error.message || 'Something went wrong';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestPasswordReset(email);
  };

  const isLoading = requestStatus === 'pending';

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex w-full h-screen">
        {/* Left - Sign In */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#8373EE] text-white px-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-8 text-black shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-2">
              Forgot Password
            </h1>
            <p className="text-sm text-center text-black/80 mb-4 ">
              Enter your email to receive a password reset link
            </p>

            <form onSubmit={handleSubmit} className="py-2 space-y-4">
              <div className="flex flex-col">
                     <label htmlFor="email" className="text-sm font-medium pb-2 block">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-5"
              />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 text-sm font-semibold cursor-pointer"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </div>
        </div>
        {/* Right - Slider */}
        <AuthSlider />
      </div>
    </>
  );
}
