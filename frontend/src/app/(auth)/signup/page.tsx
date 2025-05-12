'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AuthSlider from '@/components/shared/AuthSlider'

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left - Sign Up */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-[#7B3AED] text-white px-6">
        <div className="max-w-sm w-full space-y-6">
          <h1 className="text-3xl font-semibold text-center">Create Account</h1>
          <p className="text-center text-sm">Join Airdropz and start earning rewards</p>

          <form className="space-y-4">
            <Input type="text" placeholder="Full Name" className="bg-white text-black" />
            <Input type="email" placeholder="Email Address" className="bg-white text-black" />
            <Input type="password" placeholder="Password" className="bg-white text-black" />

            <Button className="w-full">Sign Up</Button>
            <Button variant="outline" className="w-full bg-white text-black">Sign up with Google</Button>
          </form>

          <p className="text-center text-sm">
            Already have an account? <a href="/signin" className="underline">Sign In</a>
          </p>
        </div>
      </div>

      {/* Right - Slider */}
      <AuthSlider />
    </div>
  )
}
