// done v1
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Toaster, toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthSlider from '@/components/shared/auth/AuthSlider';
import type { ResetPasswordResponse } from '@/types';

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useParams();
  const token = typeof params.token === 'string' ? params.token : '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate: resetPassword, status: resetStatus } = useMutation<
    ResetPasswordResponse,
    AxiosError,
    { token: string; password: string }
  >({
    mutationFn: async ({ token, password }) => {
      const response = await axios.post(
        `http://localhost:8080/api/auth/v1/reset-password/${token}`,
        { password }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully!');
      router.push('/login');
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

    if (!token) {
      toast.error('Invalid or expired token');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    resetPassword({ token, password });
  };

  const isLoading = resetStatus === 'pending';

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex w-full h-screen">
        {/* Left - Sign In */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#8373EE] text-white px-6">
          <div className="w-full max-w-sm rounded-xl bg-white p-8 text-black shadow-md space-y-4">
            <h1 className="text-3xl font-semibold text-center">
              Reset Password
            </h1>
            <p className="text-sm text-center text-gray-600">
              Enter your new password below
            </p>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm font-medium block pb-2"
                >
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="py-5"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium pb-2"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="py-5"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-6 text-sm font-semibold cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
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
