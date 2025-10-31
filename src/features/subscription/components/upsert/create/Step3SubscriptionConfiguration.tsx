'use client'

import { useAppForm } from '@/components/shared/form/items'
import z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { SubscriptionFormData } from '@/features/subscription/types/subscription.type'
import { useEffect, useState } from 'react'
import { useCreateSubscriptionMutation, useGetSubscriptionByIdQuery } from '@/features/subscription/api/subscriptionApi'
import { useGetAllCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { useGetAllPlanQuery } from '@/features/plan/api/planApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  goBack,
  goNext,
  setOrganizationSubscriptionId
} from '@/features/subscription/slice/organizationSubscriptionFormSlice'
import { Check } from 'lucide-react'
import { cn } from '@/utils/shadcn/utils'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { BillingCycle } from '@/features/plan/types/plan.type'

const subscriptionDefaultValues: SubscriptionFormData = {
  planBillingCycleId: 1,
  startDate: null,
  discountPercent: 0,
  maxStudentSeats: 10,
  maxTeacherSeats: 2,
  curriculumIds: []
}

export default function Step3SubscriptionConfiguration() {
  const dispatch = useAppDispatch()
  const { currentStep, organizationSubscriptionId } = useAppSelector((state) => state.organizationSubscriptionForm)
  const { data: planData } = useGetAllPlanQuery()
  const { data: curriculumData } = useGetAllCurriculumQuery()
  const { data: subscriptionData } = useGetSubscriptionByIdQuery(organizationSubscriptionId!, {
    skip: !organizationSubscriptionId
  })
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(BillingCycle.ANNUAL)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const subscription = subscriptionData?.data
  const subscriptionSchema = z.object({
    planBillingCycleId: z.number().min(1, 'Please select a plan'),
    startDate: z
      .date()
      .nullable()
      .refine((val) => val !== null, 'Start date is required'),
    discountPercent: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
    maxStudentSeats: z.number().min(1, 'At least 1 student seat required'),
    maxTeacherSeats: z.number().min(1, 'At least 1 teacher seat required'),
    curriculumIds: z.array(z.number())
  })

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

  const curriculumOptions =
    curriculumData?.data.items.map((curriculum) => ({
      label: curriculum.title,
      value: String(curriculum.id)
    })) || []

  const form = useAppForm({
    defaultValues: subscriptionDefaultValues,
    // validators: { onChange: subscriptionSchema as any },
    onSubmit: async ({ value }) => {
      if (!value.planBillingCycleId) {
        toast.error('Please select a plan')
        return
      }

      const payload = {
        planBillingCycleId: value.planBillingCycleId,
        contractId: 1,
        organizationId: 1,
        startDate: value.startDate ? value.startDate.toISOString().split('T')[0] : undefined,
        discountPercent: value.discountPercent,
        maxStudentSeats: value.maxStudentSeats,
        maxTeacherSeats: value.maxTeacherSeats,
        curriculumIds: value.curriculumIds
      }

      const res = await createSubscription(payload).unwrap()
      if (res) {
        toast.success('Subscription configured successfully!')
        dispatch(setOrganizationSubscriptionId(res.data.id))
        dispatch(goNext())
      }
    }
  })

  // Calculate end date based on start date and billing cycle
  const calculateEndDate = (startDate: Date | null, billingCycle: BillingCycle): Date | null => {
    if (!startDate) return null

    const end = new Date(startDate)
    const monthsToAdd = billingCycle === BillingCycle.ANNUAL ? 12 : 6
    end.setMonth(end.getMonth() + monthsToAdd)

    return end
  }

  // Get selected plan card details
  const selectedPlanCard = planCards.find((card) => card?.planBillingCycleId === form.state.values.planBillingCycleId)

  // Update end date when start date or billing cycle changes
  useEffect(() => {
    const startDate = form.state.values.startDate

    if (startDate) {
      const calculatedEndDate = calculateEndDate(startDate, selectedBillingCycle)
      setEndDate(calculatedEndDate)
    } else {
      setEndDate(null)
    }
  }, [form.state.values.startDate, selectedBillingCycle])

  // Update seats when plan is selected
  useEffect(() => {
    if (selectedPlanCard) {
      form.setFieldValue('maxStudentSeats', selectedPlanCard.maxStudentSeats || 10)
      form.setFieldValue('maxTeacherSeats', selectedPlanCard.maxTeacherSeats || 2)
    }
  }, [selectedPlanCard])

  // Load existing subscription data
  useEffect(() => {
    if (subscription && organizationSubscriptionId && plans.length > 0) {
      // Find the plan billing cycle to extract the billing cycle type
      const planBillingCycle = plans
        .flatMap((p) => p.planBillingCycles)
        .find((pbc) => pbc.id === subscription.planBillingCycleId)

      if (planBillingCycle) {
        setSelectedBillingCycle(planBillingCycle.billingCycle)
      }

      form.reset({
        planBillingCycleId: subscription.planBillingCycleId,
        startDate: subscription.startDate ? new Date(subscription.startDate) : null,
        discountPercent: subscription.discountPercent,
        maxStudentSeats: subscription.maxStudentSeats,
        maxTeacherSeats: subscription.maxTeacherSeats,
        curriculumIds: subscription.curriculums.filter((c) => c.id).map((c) => c.id as number)
      })
    }
  }, [subscription, organizationSubscriptionId, plans])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-6'
    >
      {/* Billing Cycle Mode Toggle */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-700'>Billing Cycle</label>
        <div className='flex items-center gap-3'>
          <div className='inline-flex rounded-full bg-slate-100 p-0.5'>
            <button
              type='button'
              onClick={() => {
                setSelectedBillingCycle(BillingCycle.SEMIANNUAL)
                // Reset plan selection when mode changes
                form.setFieldValue('planBillingCycleId', 1)
              }}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-medium transition-all',
                selectedBillingCycle === BillingCycle.SEMIANNUAL
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Semiannual
            </button>
            <button
              type='button'
              onClick={() => {
                setSelectedBillingCycle(BillingCycle.ANNUAL)
                // Reset plan selection when mode changes
                form.setFieldValue('planBillingCycleId', 1)
              }}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-medium transition-all',
                selectedBillingCycle === BillingCycle.ANNUAL
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Annual
            </button>
          </div>
          <p className='text-xs text-slate-500'>
            {selectedBillingCycle === BillingCycle.ANNUAL ? '12 months billing cycle' : '6 months billing cycle'}
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-700'>
          Select Plan <span className='text-red-500'>*</span>
        </label>
        {planCards.length === 0 ? (
          <div className='rounded-lg border-2 border-dashed border-slate-200 p-6 text-center'>
            <p className='text-sm text-slate-500'>No plans available for {selectedBillingCycle} billing cycle</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3'>
            {planCards.map((plan) => {
              const isSelected = form.state.values.planBillingCycleId === plan.planBillingCycleId

              return (
                <button
                  key={plan.planBillingCycleId}
                  type='button'
                  onClick={() => {
                    form.setFieldValue('planBillingCycleId', plan.planBillingCycleId)
                  }}
                  className={cn(
                    'relative w-full rounded-lg border-2 p-4 text-left transition-all hover:shadow-sm',
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-blue-200'
                  )}
                >
                  <div className='flex items-start justify-between gap-4'>
                    {/* Left: Plan Info */}
                    <div className='flex-1'>
                      {/* Plan Name and Price */}
                      <div className='mb-2'>
                        <h3 className='text-base font-bold text-slate-900'>{plan.name}</h3>
                        <div className='mt-1 flex items-baseline gap-1'>
                          <span className='text-2xl font-bold text-blue-600'>${plan.price.toLocaleString()}</span>
                          <span className='text-xs text-slate-500'>
                            /{selectedBillingCycle === BillingCycle.ANNUAL ? 'year' : '6 months'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Selected Indicator */}
                    {isSelected && (
                      <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500'>
                        <Check className='h-3 w-3 text-white' />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='startDate'>{(field) => <field.DatePickerField label='Start Date' />}</form.AppField>

        <div className='space-y-2'>
          <Label>End Date</Label>
          <Input
            disabled
            value={
              endDate
                ? endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : ''
            }
            placeholder='Auto-calculated'
            className='bg-slate-50'
          />
          <p className='text-xs text-slate-500'>Automatically calculated based on start date and billing cycle</p>
        </div>
      </div>

      {/* Seats Configuration */}
      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='maxStudentSeats'>
          {(field) => (
            <div className='space-y-2'>
              <field.TextField type='number' label='Max Student Seats' />
              {selectedPlanCard && (
                <p className='text-xs text-slate-500'>Default from plan: {selectedPlanCard.maxStudentSeats}</p>
              )}
            </div>
          )}
        </form.AppField>

        <form.AppField name='maxTeacherSeats'>
          {(field) => (
            <div className='space-y-2'>
              <field.TextField type='number' label='Max Teacher Seats' />
              {selectedPlanCard && (
                <p className='text-xs text-slate-500'>Default from plan: {selectedPlanCard.maxTeacherSeats}</p>
              )}
            </div>
          )}
        </form.AppField>
      </div>

      {/* Curriculum and Discount */}
      <div className='grid grid-cols-2 gap-4'>
        <form.AppField name='curriculumIds'>
          {(field) => <field.DropdownMultipleCheckboxField label='Curriculums' options={curriculumOptions} />}
        </form.AppField>

        <form.AppField name='discountPercent'>
          {(field) => (
            <div className='space-y-2'>
              <field.TextField type='number' label='Discount (%)' min={0} max={100} />
              {selectedPlanCard && form.state.values.discountPercent > 0 && (
                <p className='text-sm font-medium text-green-600'>
                  Final Price: ${(selectedPlanCard.price * (1 - form.state.values.discountPercent / 100)).toFixed(2)}
                </p>
              )}
            </div>
          )}
        </form.AppField>
      </div>

      {/* Error Display */}
      {Object.keys(form.state.errors).length > 0 && (
        <div className='rounded-md bg-red-50 p-4'>
          <h3 className='text-sm font-medium text-red-800'>Please fix the following errors:</h3>
          <ul className='mt-2 list-disc space-y-1 pl-5 text-sm text-red-700'>
            {Object.entries(form.state.errors).map(([field, errorObj], i) => {
              const message =
                typeof errorObj === 'string' ? errorObj : (errorObj as any)?.message || JSON.stringify(errorObj)
              return (
                <li key={i}>
                  <b>{field}</b>: {message}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className='mt-5 flex items-center justify-between border-t pt-6'>
        <Button variant='outline' onClick={() => dispatch(goBack())} disabled={currentStep === 1}>
          Back
        </Button>

        <div className='text-sm text-slate-600'>Step {currentStep} of 4</div>

        <form.AppForm>
          <form.SubmitButton>{isCreating ? 'Creating...' : 'Next'}</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
