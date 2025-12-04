'use client'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { useEffect, useState } from 'react'
import { useCreateSubscriptionMutation, useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useSearchPlanQuery } from '@/features/plan/api/planApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  goBack,
  goNext,
  setOrganizationSubscriptionId
} from '@/features/subscription/slice/organizationSubscriptionFormSlice'
import { BillingCycle, PlanStatus } from '@/features/plan/types/plan.type'
import { Card, CardContent } from '@/components/shadcn/card'
import { useParams, useSearchParams } from 'next/navigation'
import { SubscriptionFormData } from '@/features/subscription/types/subscription.type'
import { fileToBase64 } from '@/utils/index'

// Import các component con
import ContractSection from './ContractSection'
import BillingCycleSelector from './BillingCycleSelector'
import PlanSelector from './PlanSelector'
import SubscriptionPeriod from './SubscriptionPeriod'
import CurriculumSelector from './CurriculumSelector'
import PlanOverview from './PlanOverview'
import PricingSummary from './PricingSummary'
import { useTranslations } from 'next-intl'
import { triggerRefetchOrganization } from '@/features/organization/slice/organizationSpecialSlice'

export default function Step1SubscriptionConfiguration() {
  const tc = useTranslations('common')
  const tv = useTranslations('validation.subscription')
  const to = useTranslations('organization.subscription')
  const tt = useTranslations('toast')

  const { organizationId } = useParams()
  const dispatch = useAppDispatch()
  const { currentStep, organizationSubscriptionId } = useAppSelector((state) => state.organizationSubscriptionForm)

  const planSliceParams = useAppSelector((state) => state.plan)
  const { data: planData } = useSearchPlanQuery({ ...planSliceParams, status: PlanStatus.PUBLISHED })
  const { data: subscriptionData } = useGetSubscriptionByIdQuery(organizationSubscriptionId!, {
    skip: !organizationSubscriptionId
  })
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()

  // Form state
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(BillingCycle.ANNUAL)
  const [selectedPlanBillingCycleId, setSelectedPlanBillingCycleId] = useState<number>(0)
  const [selectedPlanInfo, setSelectedPlanInfo] = useState<{
    id: number
    name: string
    description: string
    maxStudentSeats: number
    maxTeacherSeats: number
    curriculumCount: number
    price: number
    planBillingCycleId: number
    curriculums: any[]
  } | null>(null)

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [maxStudentSeats, setMaxStudentSeats] = useState<number>(10)
  const [maxTeacherSeats, setMaxTeacherSeats] = useState<number>(2)
  const [selectedCurriculumIds, setSelectedCurriculumIds] = useState<number[]>([])

  // Contract fields
  const [contractName, setContractName] = useState<string>('')
  const [contractDescription, setContractDescription] = useState<string>('')
  const [contractFile, setContractFile] = useState<File | null>(null)

  const subscription = subscriptionData?.data
  const plans = planData?.data.items ?? []

  // Filter plans and create plan cards based on selected billing cycle
  const planCards = plans
    .map((plan) => {
      const billingCycleData = plan.planBillingCycles.find((cycle) => cycle.billingCycle === selectedBillingCycle)
      if (!billingCycleData) return null

      return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        maxStudentSeats: plan.maxStudentSeats,
        maxTeacherSeats: plan.maxTeacherSeats,
        curriculumCount: plan.curriculumCount,
        price: billingCycleData.price,
        planBillingCycleId: billingCycleData.id,
        curriculums: plan.curriculums
      }
    })
    .filter((card) => card !== null)
    .sort((a, b) => a!.price - b!.price)

  // Auto-calculate end date
  useEffect(() => {
    if (startDate) {
      const end = new Date(startDate)
      const monthsToAdd = selectedBillingCycle === BillingCycle.ANNUAL ? 12 : 6
      end.setMonth(end.getMonth() + monthsToAdd)
      end.setDate(end.getDate() - 1)
      setEndDate(end)
    } else {
      setEndDate(null)
    }
  }, [startDate, selectedBillingCycle])

  // Load existing subscription data
  useEffect(() => {
    if (subscription && organizationSubscriptionId && plans.length > 0) {
      const planBillingCycle = plans
        .flatMap((p) => p.planBillingCycles)
        .find((pbc) => pbc.id === subscription.planBillingCycleId)

      if (planBillingCycle) {
        setSelectedBillingCycle(planBillingCycle.billingCycle)
      }

      setSelectedPlanBillingCycleId(subscription.planBillingCycleId)

      const selectedCard = planCards.find((card) => card?.planBillingCycleId === subscription.planBillingCycleId)
      if (selectedCard) {
        setSelectedPlanInfo(selectedCard)
      }

      const existingStartDate = subscription.startDate ? new Date(subscription.startDate) : null
      setStartDate(existingStartDate)
      setDiscountPercent(subscription.discountPercent)
      setMaxStudentSeats(subscription.maxStudentSeats)
      setMaxTeacherSeats(subscription.maxTeacherSeats)

      const curriculumIds = subscription.curriculums.filter((c) => c.id).map((c) => c.id as number)
      setSelectedCurriculumIds(curriculumIds)
    }
  }, [subscription, organizationSubscriptionId, plans])

  const handleBillingCycleChange = (cycle: BillingCycle) => {
    setSelectedBillingCycle(cycle)
    setSelectedPlanBillingCycleId(0)
    setSelectedPlanInfo(null)
    setSelectedCurriculumIds([]) // Reset curriculum selection
  }

  const handlePlanSelect = (plan: any) => {
    setSelectedPlanBillingCycleId(plan.planBillingCycleId)
    setSelectedPlanInfo(plan)
    setMaxStudentSeats(plan.maxStudentSeats)
    setMaxTeacherSeats(plan.maxTeacherSeats)

    // Reset curriculum selection when plan changes
    setSelectedCurriculumIds([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlanBillingCycleId || selectedPlanBillingCycleId === 0) {
      toast.error(tv('plan'))
      return
    }

    if (!startDate) {
      toast.error(tv('startDate'))
      return
    }

    // Validate curriculum selection
    if (!selectedPlanInfo) {
      toast.error(tv('plan'))
      return
    }

    if (selectedCurriculumIds.length === 0) {
      toast.error(tv('curriculumIds'))
      return
    }

    if (selectedCurriculumIds.length > selectedPlanInfo.curriculumCount) {
      toast.error(tv('allowCurriculumExceed', { curriculumCount: selectedPlanInfo.curriculumCount }))
      return
    }

    const payload: SubscriptionFormData = {
      planBillingCycleId: selectedPlanBillingCycleId,
      startDate: startDate.toISOString().split('T')[0],
      discountPercent: discountPercent,
      maxStudentSeats: maxStudentSeats,
      maxTeacherSeats: maxTeacherSeats,
      curriculumIds: selectedCurriculumIds,
      organizationId: Number(organizationId),
      contract: {
        name: contractName,
        description: contractDescription,
        file: contractFile ? await fileToBase64(contractFile) : undefined
      }
    }

    const res = await createSubscription(payload).unwrap()
    if (res) {
      toast.success(tt('successMessage.create', { title: res.data.planName }))
      dispatch(setOrganizationSubscriptionId(res.data.id))
      dispatch(triggerRefetchOrganization())
      dispatch(goNext())
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* Header Section */}
      <div className='space-y-1'>
        <h2 className='text-2xl font-bold text-slate-900'>{to('create.header')}</h2>
        <p className='text-sm text-slate-500'>{to('create.description')}</p>
      </div>

      {/* Contract Section */}
      <ContractSection
        contractName={contractName}
        contractDescription={contractDescription}
        onContractNameChange={setContractName}
        onContractDescriptionChange={setContractDescription}
        onContractFileChange={setContractFile}
      />

      {/* Billing Cycle Selection */}
      <BillingCycleSelector
        selectedBillingCycle={selectedBillingCycle}
        onBillingCycleChange={handleBillingCycleChange}
      />

      {/* Plan Selection */}
      <PlanSelector
        planCards={planCards}
        selectedPlanBillingCycleId={selectedPlanBillingCycleId}
        selectedBillingCycle={selectedBillingCycle}
        onPlanSelect={handlePlanSelect}
      />

      {/* Configuration Card */}
      <Card className='border-2 border-slate-200'>
        <CardContent className='p-6'>
          <div className='space-y-6'>
            {/* Subscription Period */}
            <SubscriptionPeriod startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} />

            <div className='border-t border-slate-200'></div>

            {/* Curriculum Selection */}
            {selectedPlanInfo && (
              <CurriculumSelector
                curriculums={selectedPlanInfo.curriculums}
                selectedCurriculumIds={selectedCurriculumIds}
                onCurriculumChange={setSelectedCurriculumIds}
                maxSelection={selectedPlanInfo.curriculumCount}
              />
            )}

            <div className='border-t border-slate-300'></div>

            {/* Plan Overview Display */}
            {selectedPlanInfo && (
              <>
                <PlanOverview
                  planName={selectedPlanInfo.name}
                  planDescription={selectedPlanInfo.description}
                  maxStudentSeats={maxStudentSeats}
                  maxTeacherSeats={maxTeacherSeats}
                />
                <div className='border-t border-slate-300'></div>
              </>
            )}

            {/* Discount and Final Price */}
            {selectedPlanInfo && (
              <PricingSummary
                basePrice={selectedPlanInfo.price}
                discountPercent={discountPercent}
                onDiscountChange={setDiscountPercent}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className='flex items-center justify-between border-t-2 border-slate-200 pt-6'>
        <Button
          type='button'
          variant='outline'
          onClick={() => dispatch(goBack())}
          disabled={currentStep === 1}
          className='px-6'
        >
          {tc('button.back')}{' '}
        </Button>

        <div className='text-sm font-medium text-slate-600'>
          {tc('button.step')} <span className='text-slate-900'>{currentStep}</span>/
          <span className='text-slate-900'>2</span>
        </div>

        <Button type='submit' className='px-6' disabled={isCreating}>
          {isCreating ? (
            <span className='flex items-center gap-2'>
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
              {tc('button.submitting')}
            </span>
          ) : (
            tc('button.next')
          )}
        </Button>
      </div>
    </form>
  )
}
