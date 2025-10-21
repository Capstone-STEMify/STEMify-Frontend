'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Check, CheckCheck, CheckCircle } from 'lucide-react'
import { formatPrice } from '@/utils/index'
import { BillingCycle, Plan } from '@/features/plan/types/plan.type'
import { useAppSelector } from '@/hooks/redux-hooks'

interface PricingPlansProps {
  plans: Plan[]
}

export function PricingPlans({ plans }: PricingPlansProps) {
  const billingCycle = useAppSelector((state) => state.plan.billingCycle)
  const getPrice = (plan: Plan) => {
    const cycle = plan.planBillingCycles.find((c) => c.billingCycle === billingCycle)
    return cycle ? cycle.price : 0
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className='space-y-12'>
      {/* Billing Toggle */}

      {/* Plans Grid */}
      <motion.div variants={containerVariants} initial='hidden' animate='visible' className='grid gap-8 md:grid-cols-3'>
        {plans.map((plan, index) => {
          const price = getPrice(plan)
          const isPopular = index === 1

          return (
            <motion.div key={plan.id} variants={cardVariants}>
              <Card
                className={`relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  isPopular ? 'shadow-xl ring-2 ring-sky-400 md:scale-105' : 'hover:shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className='absolute top-0 right-0 left-0 bg-gradient-to-r from-indigo-500 to-sky-400 py-2 text-center text-sm font-semibold text-white'>
                    Most Popular
                  </div>
                )}

                <div className={`flex flex-1 flex-col p-8 ${isPopular ? 'pt-16' : ''}`}>
                  {/* Plan Name & Description */}
                  <div className='mb-6'>
                    <h3 className='mb-2 text-2xl font-bold text-gray-900'>{plan.name}</h3>
                    <p className='text-sm text-gray-600'>{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className='mb-8'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-3xl font-bold text-gray-900'>{formatPrice(price)}</span>
                      <span className='text-gray-600'>/{billingCycle === 'Annual' ? 'year' : '6 months'}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`mb-8 w-full py-6 font-semibold ${
                      isPopular
                        ? 'bg-gradient-to-r from-indigo-500 to-sky-400 text-white hover:from-indigo-600 hover:to-sky-500'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </Button>

                  {/* Features */}
                  <div className='mb-8 space-y-4'>
                    <div className='flex items-start gap-3'>
                      <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400' />
                      <div>
                        <p className='font-semibold text-gray-900'>{plan.maxTeacherSeats} Teacher Seats</p>
                        <p className='text-sm text-gray-600'>For educators</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400' />
                      <div>
                        <p className='font-semibold text-gray-900'>{plan.maxStudentSeats} Student Seats</p>
                        <p className='text-sm text-gray-600'>For learners</p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-sky-400' />
                      <div>
                        <p className='font-semibold text-gray-900'>{plan.curriculumCount} Curriculums</p>
                        <p className='text-sm text-gray-600'>STEM programs included</p>
                      </div>
                    </div>
                  </div>

                  {/* Support Details */}
                  <div className='mt-auto border-t pt-6'>
                    <p className='mb-3 text-xs font-semibold tracking-wide text-gray-900 uppercase'>Support & Access</p>
                    <div className='space-y-2 text-sm text-gray-600'>
                      {plan.accessSupportDetail.split('\n').map((line, idx) => (
                        <p key={idx} className='flex items-center gap-2'>
                          <span className='font-bold text-sky-400'>• </span>
                          <span>{line.replace('• ', '')}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
