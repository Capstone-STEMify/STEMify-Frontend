// useOrganizationSubscriptionForm.ts
import { useState } from 'react'
type Step = 1 | 2 | 3 | 4

export function useOrganizationSubscriptionForm() {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>(4)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4) as Step)
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1) as Step)

  return {
    currentStep,
    setCurrentStep,
    goNext,
    goBack,
    loading,
    setLoading
  }
}
