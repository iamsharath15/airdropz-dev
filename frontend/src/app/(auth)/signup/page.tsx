'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthSlider from '@/components/shared/AuthSlider';

interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  referralCode?: string;
}

interface ApiResponse {
  message: string;
}

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: '',
    referralCode: '',
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  // Register user mutation
  const registerMutation = useMutation<ApiResponse, AxiosError, SignUpFormData>(
    {
      mutationFn: async (data) => {
        const response = await axios.post<ApiResponse>(
          'http://localhost:8080/api/auth/v1/signup',
          data
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success(
          'User registered successfully! Please enter the OTP sent to your email.'
        );
        setShowOtpInput(true);
      },
      onError: (error) => {
        const data = error.response?.data as {
          message?: string;
          error?: string;
        };
        const message =
          data?.message ||
          data?.error ||
          error.message ||
          'Signup failed, please try again';
        toast.error(message);
      },
    }
  );

  // Verify OTP mutation
  const verifyOtpMutation = useMutation<ApiResponse, AxiosError, string>({
    mutationFn: async (code) => {
      const response = await axios.post(
        'http://localhost:8080/api/auth/v1/verify-email',
        { code }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Email verified successfully!');
      router.push('/login');
    },
    onError: (error) => {
      const data = error.response?.data as { message?: string; error?: string };
      const message =
        data?.message ||
        data?.error ||
        error.message ||
        'OTP verification failed';
      toast.error(message);
    },
  });

  // Handle input change for signup form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle signup form submit
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  // Handle OTP form submit
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP code');
      return;
    }
    verifyOtpMutation.mutate(otp);
  };

  // Helper to check loading status
  const isRegistering = registerMutation.status === 'pending';
  const isVerifyingOtp = verifyOtpMutation.status === 'pending';

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen w-full">
        {/* Left - Sign Up Form or OTP Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#8373EE] text-white px-6">
          <div className="max-w-sm w-full space-y-6">
            {!showOtpInput ? (
              <>
                <h1 className="text-3xl font-semibold text-center">
                  Create Account
                </h1>
                <p className="text-center text-sm font-semibold">
                  Join Airdropz and start earning rewards
                </p>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-bold mb-1 pb-1"
                    >
                      Name
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your full name"
                      className="bg-white text-black placeholder:text-black py-5"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold mb-1 pb-1"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white text-black placeholder:text-black py-5"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-bold mb-1 pb-1"
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-white text-black placeholder:text-black py-5"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="referralCode"
                      className="block text-sm font-bold mb-1 pb-2"
                    >
                      Referral Code
                    </label>
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Enter Code"
                      className="bg-white text-black placeholder:text-black py-5"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-6 font-semibold text-sm cursor-pointer"
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                </form>

                <p className="text-center text-sm">
                  Already have an account?{' '}
                  <a href="/signin" className="underline">
                    Sign In
                  </a>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-semibold text-center">
                  Verify OTP
                </h1>
                <p className="text-center text-sm font-semibold">
                  Enter the 6-digit OTP sent to your email
                </p>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="Enter OTP"
                    className="bg-white text-black placeholder:text-black py-5 text-center tracking-widest text-xl"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full py-6 font-semibold text-sm cursor-pointer"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Right - Slider */}
        <AuthSlider />
      </div>
    </>
  );
}
