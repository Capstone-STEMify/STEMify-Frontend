'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SubscriptionHeader } from './header/SubscriptionHeader'
import { BillingToggle } from './toggle/BillingToggle'
import { PricingPlanItem } from './card/PricingPlan'

export default function SubscriptionPlan() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(2)

  const plans = [
    {
      title: 'Starter',
      price: 19,
      description: 'Unleash the power of automation.',
      features: ['Multi-step Zaps', '3 Premium Apps', '2 Users team']
    },
    {
      title: 'Professional',
      price: 54,
      description: 'Advanced tools to take your work to the next level.',
      features: ['Multi-step Zaps', 'Unlimited Premium', '50 Users team', 'Shared Workspace']
    },
    {
      title: 'Company',
      price: 89,
      description: 'Automation plus enterprise-grade features.',
      features: [
        'Multi-step Zap',
        'Unlimited Premium',
        'Unlimited Users Team',
        'Advanced Admin',
        'Custom Data Retention'
      ],
      isPopular: true
    }
  ]

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 px-4 py-5 pt-20 md:pt-15'>
      <div className='mx-auto w-full max-w-5xl'>
        <div>
          <div className='mb-12 flex flex-col items-center justify-between md:flex-row'>
            <SubscriptionHeader />
            <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className='rounded-3xl bg-white px-15 py-5 shadow-2xl'>
              <div className='flex flex-col gap-10 md:flex-row md:gap-0'>
                {plans.map((plan, index) => (
                  <PricingPlanItem
                    key={index}
                    {...plan}
                    isSelected={selectedPlan === index}
                    onSelect={() => setSelectedPlan(index)}
                    isYearly={isYearly}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
