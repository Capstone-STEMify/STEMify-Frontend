'use client'
import SkipModal from '@/features/classroom/components/creation-steps/SkipModal'
import StepFour from '@/features/classroom/components/creation-steps/StepFour'
import StepOne from '@/features/classroom/components/creation-steps/StepOne'
import StepThree from '@/features/classroom/components/creation-steps/StepThree'
import StepTwo from '@/features/classroom/components/creation-steps/StepTwo'
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

import { useState } from 'react'

interface CreationData {
  classroomName?: string
  userName?: string
  // Add other fields as needed
}

const CreationSteps: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<CreationData>({})
  const [showSkipModal, setShowSkipModal] = useState(false)

  const totalSteps = 4

  const updateData = (newData: any) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.classroomName && data.classroomName.trim().length > 0
      case 2:
        return data.userName && data.userName.trim().length > 0
      case 3:
        return true // Can skip team members
      case 4:
        return true
      default:
        return false
    }
  }

  const handleSkip = () => {
    if (currentStep === 3) {
      setShowSkipModal(true)
    }
  }

  const confirmSkip = () => {
    setShowSkipModal(false)
    nextStep()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne data={data} updateData={updateData} />
      case 2:
        return <StepTwo data={data} updateData={updateData} />
      case 3:
        return <StepThree data={data} updateData={updateData} />
      case 4:
        return <StepFour data={data} updateData={updateData} />
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Classroom Information'
      case 2:
        return 'Personal Details'
      case 3:
        return "Classroom's Students"
      case 4:
        return 'Classroom Settings'
      default:
        return ''
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Progress Bar */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-4xl px-4 py-4'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-600'>
              Step {currentStep} of {totalSteps}
            </span>
            <span className='text-sm text-gray-500'>{getStepTitle()}</span>
          </div>
          <div className='h-2 w-full rounded-full bg-gray-200'>
            <div
              className='h-2 rounded-full bg-blue-500 transition-all duration-300'
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto max-w-4xl px-4 py-12'>
        <div className='mb-8'>{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className='mx-auto flex max-w-md items-center justify-between'>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center rounded-lg px-6 py-3 transition-colors ${
              currentStep === 1 ? 'cursor-not-allowed text-gray-400' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            Previous
          </button>

          <div className='flex gap-3'>
            {currentStep === 3 && (
              <button
                onClick={handleSkip}
                className='rounded-lg px-6 py-3 text-gray-600 transition-colors hover:bg-gray-100'
              >
                Skip for now
              </button>
            )}

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center rounded-lg px-6 py-3 transition-colors ${
                canProceed()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            >
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle className='mr-2 h-4 w-4' />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className='ml-2 h-4 w-4' />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Skip Modal */}
      <SkipModal isOpen={showSkipModal} onClose={() => setShowSkipModal(false)} onConfirm={confirmSkip} />
    </div>
  )
}

export default CreationSteps
