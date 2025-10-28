// useOrganizationSubscriptionForm.ts
import { useState } from 'react'
type Step = 1 | 2 | 3 | 4

export function useOrganizationSubscriptionForm() {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>(1)

  const [collectedData, setCollectedData] = useState({
    organization: null,
    contract: null,
    subscription: null,
    admins: null
  })

  const updateStepData = (stepKey: keyof typeof collectedData, data: any) => {
    setCollectedData((prev) => ({ ...prev, [stepKey]: data }))
  }

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4) as Step)
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1) as Step)

  const submitOrganization = async (data: any) => {
    console.log('📦 Submitting organization', data)
    // const res = await api.createOrganization(data)
    updateStepData('organization', data)
    goNext()
  }

  const submitContract = async (data: any) => {
    console.log('📄 Submitting contract', data)
    updateStepData('contract', data)
    goNext()
  }

  const submitSubscription = async (data: any) => {
    console.log('🧾 Submitting subscription', data)
    updateStepData('subscription', data)
    goNext()
  }

  const submitAdmins = async (data: any) => {
    console.log('👤 Submitting admins', data)
    updateStepData('admins', data)
  }

  return {
    currentStep,
    setCurrentStep,
    goNext,
    goBack,
    collectedData,
    updateStepData,
    submitOrganization,
    submitContract,
    submitSubscription,
    submitAdmins,
    loading,
    setLoading
  }
}
