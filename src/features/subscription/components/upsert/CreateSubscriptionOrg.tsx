'use client'

import type React from 'react'

import { Card } from '@/components/shadcn/card'
import { Check } from 'lucide-react'
import {} from 'sonner'
import { useAppSelector } from '@/hooks/redux-hooks'
import Step1SubscriptionConfiguration from '@/features/subscription/components/upsert/Step1SubscriptionConfiguration'
import Step2AdminAccounts from '@/features/subscription/components/upsert/Step2AdminAccounts'
import { useTranslations } from 'next-intl'

export default function CreateOrganizationSubscription() {
  const to = useTranslations('organization.subscription')

  const { currentStep } = useAppSelector((state) => state.organizationSubscriptionForm)

  const steps = [
    { number: 1, title: to('step1.title'), description: to('step1.description') },
    { number: 2, title: to('step2.title'), description: to('step2.description') }
  ]

  return (
    <div className='mx-auto max-w-5xl'>
      {/* Header */}
      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl font-bold text-slate-900'>{to('header')}</h1>
        <p className='text-slate-600'>{to('subHeader')}</p>
      </div>

      {/* Step Indicator */}
      <div className='mb-8 flex justify-center'>
        {steps.map((step, index) => (
          <div key={step.number} className='flex items-center'>
            <div className='flex flex-col items-center'>
              {/* Circle */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  currentStep > step.number
                    ? 'border-transparent bg-sky-500 text-white shadow-md'
                    : currentStep === step.number
                      ? 'border-sky-400 bg-white text-sky-500 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className='h-5 w-5' />
                ) : (
                  <span className='text-lg font-semibold'>{step.number}</span>
                )}
              </div>

              {/* Label */}
              <div className='mt-2 text-center'>
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-sky-500' : 'text-slate-400'}`}>
                  {step.title}
                </p>
                <p className='text-xs text-slate-500'>{step.description}</p>
              </div>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={`mx-6 h-0.5 w-16 transition-all duration-300 ${
                  currentStep > step.number ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card className='mb-10 p-8'>
        {currentStep === 1 && <Step1SubscriptionConfiguration />}
        {currentStep === 2 && <Step2AdminAccounts />}
      </Card>
    </div>
  )
}
