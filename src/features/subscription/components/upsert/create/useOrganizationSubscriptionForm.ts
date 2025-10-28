// useOrganizationSubscriptionForm.ts
import { useState } from 'react'
type Step = 1 | 2 | 3 | 4

export function useOrganizationSubscriptionForm() {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>(1)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4) as Step)
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1) as Step)

  const submitContract = async (data: any) => {
    console.log('📄 Submitting contract', data)
    goNext()
  }

  const submitSubscription = async (data: any) => {
    console.log('🧾 Submitting subscription', data)
    goNext()
  }

  const submitAdmins = async (data: any) => {
    console.log('👤 Submitting admins', data)
  }

  return {
    currentStep,
    setCurrentStep,
    goNext,
    goBack,
    submitContract,
    submitSubscription,
    submitAdmins,
    loading,
    setLoading
  }
}
