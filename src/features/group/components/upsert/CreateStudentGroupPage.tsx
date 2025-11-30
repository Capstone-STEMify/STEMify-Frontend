'use client'
import { useState } from 'react'
import Step1SelectStudentGroup from './Step1SelectStudentGroup'
import Step2CreateStudentGroup from './Step2CreateStudentGroup'

export default function CreateStudentGroupPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<{
    numberOfStudents: number
    gradeLevel: number
    selectedStudentIds: string[]
  } | null>(null)

  const handleStep1Next = (data: { numberOfStudents: number; gradeLevel: number; selectedStudentIds: string[] }) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const handleStep2Back = () => {
    setCurrentStep(1)
  }

  return (
    <div className='container mx-auto max-w-5xl px-4 py-8'>
      <div className='mb-8'>
        <div className='flex items-center gap-2'>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            1
          </div>
          <div className='bg-muted h-1 flex-1'>
            <div className={`h-full transition-all ${currentStep === 2 ? 'bg-primary w-full' : 'w-0'}`} />
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            2
          </div>
        </div>
      </div>

      {currentStep === 1 && <Step1SelectStudentGroup onNext={handleStep1Next} />}

      {currentStep === 2 && step1Data && (
        <Step2CreateStudentGroup
          numberOfStudents={step1Data.numberOfStudents}
          gradeLevel={step1Data.gradeLevel}
          selectedStudentIds={step1Data.selectedStudentIds}
          onBack={handleStep2Back}
        />
      )}
    </div>
  )
}
