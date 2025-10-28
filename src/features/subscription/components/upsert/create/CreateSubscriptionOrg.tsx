'use client'

import type React from 'react'

import { Card } from '@/components/shadcn/card'
import { Check } from 'lucide-react'
import Step1OrganizationCreation from '@/features/subscription/components/upsert/create/Step1OrganizationCreation'
import Step2ContractCreation from '@/features/subscription/components/upsert/create/Step2ContractCreation'
import Step3SubscriptionConfiguration from '@/features/subscription/components/upsert/create/Step3SubscriptionConfiguration'
import Step4AdminAccounts from '@/features/subscription/components/upsert/create/Step4AdminAccounts'
import {} from 'sonner'
import { useOrganizationSubscriptionForm } from '@/features/subscription/components/upsert/create/useOrganizationSubscriptionForm'
import { useEffect } from 'react'

export default function CreateOrganizationSubscription() {
  const formWizard = useOrganizationSubscriptionForm()

  const steps = [
    { number: 1, title: 'Create Organization', description: 'Organization details' },
    { number: 2, title: 'Create Contract', description: 'Set up contract details' },
    { number: 3, title: 'Configure Subscription', description: 'Select plan and options' },
    { number: 4, title: 'Add Admin Accounts', description: 'Grant access to admins' }
  ]

  return (
    <div className=''>
      <div className='mx-auto max-w-5xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-slate-900'>Create Organization Subscription</h1>
          <p className='text-slate-600'>Follow the steps to set up your organization</p>
        </div>

        {/* Step Indicator */}
        <div className='mb-8 flex justify-center'>
          {steps.map((step, index) => (
            <div key={step.number} className='flex items-center'>
              {/* Step Circle + Text */}
              <div className='flex flex-col items-center'>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                    formWizard.currentStep > step.number
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : formWizard.currentStep === step.number
                        ? 'border-slate-900 bg-white text-slate-900'
                        : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {formWizard.currentStep > step.number ? (
                    <Check className='h-6 w-6' />
                  ) : (
                    <span className='text-lg font-semibold'>{step.number}</span>
                  )}
                </div>
                <div className='mt-2 text-center'>
                  <p
                    className={`text-sm font-medium ${
                      formWizard.currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className='text-xs text-slate-500'>{step.description}</p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`mx-6 h-0.5 w-16 transition-all ${
                    formWizard.currentStep > step.number ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card className='p-8'>
          {formWizard.currentStep === 1 && <Step1OrganizationCreation formWizard={formWizard} />}
          {formWizard.currentStep === 2 && <Step2ContractCreation formWizard={formWizard} />}
          {formWizard.currentStep === 3 && <Step3SubscriptionConfiguration formWizard={formWizard} />}
          {formWizard.currentStep === 4 && <Step4AdminAccounts formWizard={formWizard} />}
        </Card>
      </div>
    </div>
  )
}
