'use client'

import React from 'react'
import BackButton from '@/components/shared/button/BackButton'
import { useTranslations } from 'next-intl'

type ClassroomStepIndicatorProps = {
  currentStep: number
}

export default function ClassroomStepIndicator({ currentStep }: ClassroomStepIndicatorProps) {
  const tClassroom = useTranslations('classroom')

  const STEPS = [
    { id: 1, title: tClassroom('create.step1.title'), description: tClassroom('create.step1.subtitle') },
    { id: 2, title: tClassroom('create.step2.title'), description: tClassroom('create.step2.subtitle') }
  ]
  return (
    <div className='border-b bg-gradient-to-b from-gray-50 to-white px-6 py-5'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-10 flex items-center justify-between'>
          <BackButton />

          <div className='absolute left-1/2 -translate-x-1/2 text-center'>
            <h2 className='text-2xl font-bold text-gray-900'>{tClassroom('create.header')}</h2>
            <p className='mt-1 text-sm text-gray-500'>{tClassroom('create.subheader')}</p>
          </div>
        </div>

        {/* Line Container */}
        <div className='relative flex items-center justify-between'>
          {/* Background Line */}
          <div className='absolute top-5 left-0 h-1 w-full rounded-full bg-gray-200' />

          {/* Progress Line */}
          <div
            className='absolute top-5 left-0 h-1 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500 ease-out'
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`
            }}
          />

          {/* Steps */}
          {STEPS.map((step) => (
            <div key={step.id} className='relative z-10 flex flex-col items-center'>
              {/* Circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-4 bg-white transition-all duration-300 ${
                  currentStep === step.id
                    ? 'scale-110 border-sky-500 shadow-lg shadow-sky-200'
                    : currentStep > step.id
                      ? 'border-sky-500'
                      : 'border-gray-300'
                }`}
              >
                {currentStep > step.id ? (
                  <svg className='h-5 w-5 text-sky-500' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <span className={`text-sm font-bold ${currentStep === step.id ? 'text-sky-500' : 'text-gray-400'}`}>
                    {step.id}
                  </span>
                )}
              </div>

              {/* Step Info */}
              <div className='mt-3 text-center' style={{ minWidth: '500px' }}>
                <p
                  className={`text-sm font-semibold transition-colors ${
                    currentStep === step.id ? 'text-sky-600' : currentStep > step.id ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className='mt-0.5 text-xs leading-tight text-gray-400'>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
