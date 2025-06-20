'use client'

import { Input } from '@/components/ui/input'
import React, { useRef } from 'react'

type OtpInputProps = {
  length?: number
  onChange: (otp: string) => void
}

export default function OtpInput({ length = 6, onChange }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, '')

    // Handle paste
    if (val.length > 1) {
      val.split('').forEach((char, i) => {
        const targetIndex = index + i
        if (targetIndex < length && inputsRef.current[targetIndex]) {
          inputsRef.current[targetIndex]!.value = char
        }
      })

      const otp = inputsRef.current.map((input) => input?.value || '').join('')
      onChange(otp)

      const nextIndex = index + val.length < length ? index + val.length : length - 1
      inputsRef.current[nextIndex]?.focus()
      return
    }

    // Single input
    if (val) {
      inputsRef.current[index]!.value = val[0]
      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    }

    const otp = inputsRef.current.map((input) => input?.value || '').join('')
    onChange(otp)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !inputsRef.current[index]?.value && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')

    pasted.split('').forEach((char, i) => {
      const targetIndex = index + i
      if (targetIndex < length && inputsRef.current[targetIndex]) {
        inputsRef.current[targetIndex]!.value = char
      }
    })

    const otp = inputsRef.current.map((input) => input?.value || '').join('')
    onChange(otp)

    const nextIndex = index + pasted.length < length ? index + pasted.length : length - 1
    inputsRef.current[nextIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-2">
      {[...Array(length)].map((_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-center text-xl bg-white text-black"
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
        />
      ))}
    </div>
  )
}
