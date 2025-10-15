// file: BillingToggle.tsx

import React from 'react'
import { motion } from 'framer-motion'

interface BillingToggleProps {
  isYearly: boolean
  onToggle: (isYearly: boolean) => void
}

export function BillingToggle({ isYearly, onToggle }: BillingToggleProps) {
  const spring = {
    type: 'spring',
    stiffness: 500,
    damping: 30
  } as const

  return (
    <div className='flex w-fit items-center rounded-full border bg-white p-1 shadow-lg'>
      <button
        onClick={() => onToggle(false)}
        className={`relative w-24 py-2 text-center text-sm font-semibold transition-colors duration-300 ${
          !isYearly ? 'text-white' : 'text-slate-500'
        }`}
      >
        {!isYearly && (
          <motion.span layoutId='pill' className='absolute inset-0 z-0 rounded-full bg-sky-400' transition={spring} />
        )}
        <span className='relative z-10'>SEMESTERLY</span>
      </button>

      <button
        onClick={() => onToggle(true)}
        className={`relative w-24 py-2 text-center text-sm font-semibold transition-colors duration-300 ${
          isYearly ? 'text-white' : 'text-slate-500'
        }`}
      >
        {isYearly && (
          <motion.span layoutId='pill' className='absolute inset-0 z-0 rounded-full bg-sky-400' transition={spring} />
        )}
        <span className='relative z-10'>YEARLY</span>
      </button>
    </div>
  )
}
