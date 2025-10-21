import React from 'react'
import { motion } from 'framer-motion'
import { Plan } from '@/features/plan/types/plan.type'

interface PricingPlanItemProps {
  plan: Plan
  isSelected: boolean
  onSelect: () => void
  isYearly: boolean
}

export function PricingPlanItem({ plan, isSelected, onSelect, isYearly }: PricingPlanItemProps) {
  const isPopular = plan.id === 2

  return (
    <motion.div
      onClick={onSelect}
      className={`relative flex flex-1 cursor-pointer flex-col rounded-2xl p-8 transition-colors duration-300 ${
        isSelected ? 'bg-slate-900 text-white' : 'bg-transparent text-slate-800'
      }`}
      animate={{
        scale: isSelected ? 1.05 : 1,
        y: isSelected ? -20 : 0,
        zIndex: isSelected ? 10 : 1
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {isPopular && (
        <div className='flex justify-end'>
          <span className='rounded-full bg-slate-700 px-4 py-1 text-xs font-bold tracking-wider text-sky-400 uppercase'>
            Most Popular
          </span>
        </div>
      )}

      <div className='mb-6 pt-4'>
        <motion.div
          key={plan.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='mb-3 flex items-baseline gap-1'
        >
          <span className={`text-base ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
            {isYearly ? '/ 12 months' : '/ 6 months'}
          </span>
        </motion.div>
        <h3 className='mb-2 text-xl font-semibold'>{plan.name}</h3>
        <p className={`h-10 text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{plan.description}</p>
      </div>

      <div className='mb-8 flex-grow space-y-2'>{plan.accessSupportDetail}</div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full rounded-full py-3 text-sm font-semibold transition-all ${
          isSelected ? 'bg-sky-400 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Contact Us
      </motion.button>
    </motion.div>
  )
}
