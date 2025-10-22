'use client'

import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setParam } from '@/features/plan/slice/planProductSlice'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { containerVariants, itemVariants } from '@/utils/motion'
import { useEffect } from 'react'

export function SubscriptionHeader() {
  const dispatch = useAppDispatch()
  const billingCycle = useAppSelector((state) => state.plan.billingCycle)

  const handleSelect = (cycle: BillingCycle) => {
    dispatch(setParam({ key: 'billingCycle', value: cycle }))
  }

  useEffect(() => {
    if (!billingCycle) {
      dispatch(setParam({ key: 'billingCycle', value: BillingCycle.SIXMONTHS }))
    }
  }, [billingCycle, dispatch])

  return (
    <div className='flex flex-col justify-between gap-8 md:flex-row md:items-center'>
      {/* Left Section: Title + Description */}
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='flex flex-col gap-4'>
        <motion.div variants={itemVariants} className='flex items-center gap-3'>
          <div className='h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400' />
          <span className='text-sm font-semibold tracking-widest text-sky-500 uppercase'>Flexible Plans</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className='mb-2 text-4xl font-bold md:text-6xl'>
          <span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>
            Plans & Pricing
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className='max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg'>
          Whether your time-saving automation needs are large or small, we're here to help you scale.
          <span className='mt-2 block text-slate-500'>
            Choose the perfect plan for your team and unlock unlimited potential.
          </span>
        </motion.p>
      </motion.div>

      {/* Right Section: Billing Cycle Switch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className='flex justify-center md:justify-end'
      >
        <div className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 p-1 shadow-sm backdrop-blur-md'>
          {[
            { label: 'Semiannual', value: BillingCycle.SIXMONTHS },
            { label: 'Annual', value: BillingCycle.TWELVEMONTHS }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${
                billingCycle === option.value
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
