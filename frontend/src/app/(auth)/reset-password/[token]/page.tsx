'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Toaster, toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiResponse {
  message: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const token = typeof params.token === 'string' ? params.token : '';
  console.log('Token:', token);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetPasswordMutation = useMutation<
    ApiResponse,
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
      toast.success(
        data.message || 'Password reset successful! You can now log in.'
      );
      router.push('/login');
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string; error?: string };
      const message =
        data?.message ||
        data?.error ||
        error.message ||
        'Failed to reset password';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password should be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }

    resetPasswordMutation.mutate({ token, password });
  };

  const isLoading = resetPasswordMutation.status === "pending"

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen w-full justify-center items-center bg-[#8373EE] text-white px-6">
        <div className="max-w-sm w-full space-y-6 bg-white rounded-xl p-8 text-black">
          <h1 className="text-3xl font-semibold text-center">Reset Password</h1>
          <p className="text-center text-sm font-semibold mb-6">
            Enter your new password below
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="password"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="py-5"
            />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="py-5"
            />
            <Button
              type="submit"
              className="w-full py-6 font-semibold text-sm cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
