// done v1
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthSlider from '@/components/shared/auth/AuthSlider';

import type { SignUpFormData, ApiResponse } from '@/types';

const initialFormData: SignUpFormData = {
  userName: '',
  email: '',
  password: '',
  referralCode: '',
};

const fieldConfigs: {
  id: keyof SignUpFormData;
  label: string;
  type: string;
  required?: boolean;
}[] = [
  { id: 'userName', label: 'Name', type: 'text', required: true },
  { id: 'email', label: 'Email', type: 'email', required: true },
  { id: 'password', label: 'Password', type: 'password', required: true },
  { id: 'referralCode', label: 'Referral Code', type: 'text' },
];

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const registerMutation = useMutation<ApiResponse, AxiosError, SignUpFormData>(
    {
      mutationFn: async (data) =>
        (
          await axios.post<ApiResponse>(
            'http://localhost:8080/api/auth/v1/signup',
            data
          )
        ).data,

      onSuccess: () => {
        toast.success(
          'User registered successfully! Please verify your email.'
        );
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`
        );
      },

      onError: (error) => {
        const data = error.response?.data as {
          message?: string;
          error?: string;
        };
        toast.error(
          data?.message ||
            data?.error ||
            error.message ||
            'Signup failed, please try again'
        );
      },
    }
  );

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const isRegistering = registerMutation.isPending;

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen w-full">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#8373EE] text-white px-6">
          <div className="md:w-8/12 w-full">
            <h1 className="text-3xl font-semibold text-center pb-3">
              Create Account
            </h1>
            <p className="text-center text-sm font-semibold pb-6">
              Join LootCrate and start earning rewards
            </p>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {fieldConfigs.map(({ id, label, type, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-bold pb-2">
                    {label}
                  </label>
                  <Input
                    id={id}
                    type={type}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="bg-white text-black placeholder:text-black py-5"
                    value={formData[id] ?? ''}
                    onChange={handleInputChange}
                    required={required}
                  />
                </div>
              ))}

              <Button
                type="submit"
                className="w-full py-6 font-semibold text-sm cursor-pointer my-2"
                disabled={isRegistering}
              >
                {isRegistering ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>

            <p className="text-center text-sm">
              Already have an account?{' '}
              <a href="/login" className="underline cursor-pointer">
                Log In
              </a>
            </p>
          </div>
        </div>

        {/* Right - Slider */}
        <AuthSlider />
      </div>
    </>
  );
}
