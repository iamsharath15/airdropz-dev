'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Toaster, toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiResponse {
  message: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const forgotPasswordMutation = useMutation<ApiResponse, AxiosError, string>({
    mutationFn: async (email) => {
      const response = await axios.post('http://localhost:8080/api/auth/v1/request-password-reset', { email });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset link sent! Check your email.');
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string; error?: string };
      const message = data?.message || data?.error || error.message || 'Failed to send reset link';
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  const isLoading = forgotPasswordMutation.status === "pending"

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen w-full justify-center items-center bg-[#8373EE] text-white px-6">
        <div className="max-w-sm w-full space-y-6 bg-white rounded-xl p-8 text-black">
          <h1 className="text-3xl font-semibold text-center">Forgot Password</h1>
          <p className="text-center text-sm font-semibold mb-6">
            Enter your email to receive a password reset link
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-5"
            />
            <Button
              type="submit"
              className="w-full py-6 font-semibold text-sm cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
