// done v1
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthSlider from '@/components/shared/auth/AuthSlider';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import type { LoginResponse } from '@/types';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation<{ data: LoginResponse }, AxiosError>({
    mutationFn: async () => {
      const response = await axios.post<{ data: LoginResponse }>(
        'http://localhost:8080/api/auth/v1/login',
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: ({ data }) => {
      dispatch(setCredentials({ user: data }));
      toast.success('Logged in successfully!');

      if (data.is_new_user === true) {
        router.push('/onboarding');
      } else if (data.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    },

    onError: async (error) => {
      const data = error.response?.data as { message?: string; error?: string };
      const message =
        data?.message || data?.error || error?.message || 'Login failed';

      toast.error(message);

      if (message === 'Email not verified.') {
        try {
          await axios.post('http://localhost:8080/api/auth/v1/resend-otp', {
            email,
          });
          router.push(`/verify-email?email=${email}`);
          toast.success('OTP resent. Please verify your email.');
        } catch (resendError: unknown) {
          const err = resendError as AxiosError<{ message: string }>;
          toast.error(err.response?.data?.message || 'Failed to resend OTP.');
        }
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };
  const isLogin = loginMutation.status === 'pending';

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex w-full h-screen">
        {/* Left - Sign In */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#8373EE] text-white px-6">
          <div className="max-w-sm w-full space-y-2">
            <h1 className="text-3xl font-semibold text-center">
              Welcome to Airdropz
            </h1>
            <p className="text-center text-sm pb-4">
              Enter your email and password to access your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label
                htmlFor="email"
                className="block text-sm font-bold mb-1 pb-2"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="bg-white text-black placeholder:text-black py-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label
                htmlFor="password"
                className="block text-sm font-bold mb-1 pb-2"
              >
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="bg-white text-black placeholder:text-black py-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password" className="underline">
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-sm font-semibold cursor-pointer"
              >
                {isLogin ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{' '}
              <Link href="/signup" className="underline ">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Right - Slider */}
        <AuthSlider />
      </div>
    </>
  );
}
