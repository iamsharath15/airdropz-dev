'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AuthSlider from '@/components/shared/AuthSlider'

export default function SignInPage() {
  return (
    <div className="flex w-full h-screen">
      {/* Left - Sign In */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#8373EE] text-white px-6">
        <div className="max-w-sm w-full space-y-6">
          <h1 className="text-3xl font-semibold text-center">Welcome Airdropz</h1>
          <p className="text-center text-sm">Enter your email and password to access your account</p>

          <form className="space-y-4">
            <Input type="email" placeholder="Enter your email" className="bg-white text-black" />
            <Input type="password" placeholder="Enter your password" className="bg-white text-black" />

            <div className="flex items-center justify-between text-sm">
           
              <a href="#" className="underline">Forgot Password?</a>
            </div>

            <Button className="w-full">Sign In</Button>
            <Button variant="outline" className="w-full bg-white text-black">Sign in with Google</Button>
          </form>

          <p className="text-center text-sm">
            Don’t have an account? <a href="/signup" className="underline">Sign Up</a>
          </p>
        </div>
      </div>
      {/* Right - Slider */}
      <AuthSlider />
    </div>
  )
}
