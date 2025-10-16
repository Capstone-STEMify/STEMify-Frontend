'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Check, Upload, X } from 'lucide-react'
import Step3AdminAccounts from '@/features/subscription/components/upsert/create/Step3AdminAccounts'
import Step2SubscriptionConfiguration from '@/features/subscription/components/upsert/create/Step2SubscriptionConfiguration'
import Step1OrganizationCreation from '@/features/subscription/components/upsert/create/Step1OrganizationCreation'

type Step = 1 | 2 | 3

type AdminAccount = {
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export default function CreateOrganizationSubscription() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [formData, setFormData] = useState({
    // Step 1: Organization
    organizationName: '',
    organizationImage: null as File | null,
    organizationType: '',
    // Step 2: Subscription
    package: '',
    billingCycle: '',
    tier: '',
    seats: '',
    curriculum: '',
    // Step 3: Admin Accounts
    admins: [{ email: '', firstName: '', lastName: '', phoneNumber: '' }] as AdminAccount[]
  })

  const steps = [
    { number: 1, title: 'Create Organization', description: 'Organization details' },
    { number: 2, title: 'Configure Subscription', description: 'Select plan and options' },
    { number: 3, title: 'Add Admin Accounts', description: 'Grant access to admins' }
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = () => {
    console.log('[v0] Form submitted:', formData)
    // Handle final submission
  }

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
          <div className='flex items-center justify-center'>
            {steps.map((step, index) => (
              <div key={step.number} className='flex items-center'>
                {/* Step Circle + Text */}
                <div className='flex flex-col items-center'>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      currentStep > step.number
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : currentStep === step.number
                          ? 'border-slate-900 bg-white text-slate-900'
                          : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className='h-6 w-6' />
                    ) : (
                      <span className='text-lg font-semibold'>{step.number}</span>
                    )}
                  </div>
                  <div className='mt-2 text-center'>
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
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
                      currentStep > step.number ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className='p-8'>
          {currentStep === 1 && <Step1OrganizationCreation formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <Step2SubscriptionConfiguration formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <Step3AdminAccounts formData={formData} setFormData={setFormData} />}

          {/* Navigation Buttons */}
          <div className='mt-8 flex items-center justify-between border-t pt-6'>
            <Button
              variant='outline'
              onClick={handleBack}
              disabled={currentStep === 1}
              className='min-w-24 bg-transparent'
            >
              Back
            </Button>
            <div className='text-sm text-slate-600'>
              Step {currentStep} of {steps.length}
            </div>
            {currentStep < 3 ? (
              <Button onClick={handleNext} className='min-w-24 bg-slate-900 hover:bg-slate-800'>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className='min-w-24 bg-slate-900 hover:bg-slate-800'>
                Submit
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
