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
import { Check, Calendar, Users, GraduationCap, Tag } from 'lucide-react'
import { cn } from '@/utils/shadcn/utils'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { Card, CardContent } from '@/components/shadcn/card'

const subscriptionDefaultValues: SubscriptionFormData = {
  planBillingCycleId: 0,
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

  const subscription = subscriptionData?.data
  const subscriptionSchema = z.object({
    planBillingCycleId: z.number().refine((val) => val > 0, 'Please select a plan'),
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
    // validators: { onChange: subscriptionSchema as any }, // Remove onChange validation
    onSubmit: async ({ value }) => {
      if (!value.planBillingCycleId || value.planBillingCycleId === 0) {
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

      try {
        const res = await createSubscription(payload).unwrap()
        if (res) {
          toast.success('Subscription configured successfully!')
          dispatch(setOrganizationSubscriptionId(res.data.id))
          dispatch(goNext())
        }
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to create subscription')
      }
    }
  })

  const selectedPlanCard = planCards.find((card) => card?.planBillingCycleId === selectedPlanBillingCycleId)

  useEffect(() => {
    console.log('Start date changed:', startDate, 'Billing cycle:', selectedBillingCycle)

    if (startDate) {
      const end = new Date(startDate)
      const monthsToAdd = selectedBillingCycle === BillingCycle.ANNUAL ? 12 : 6
      end.setMonth(end.getMonth() + monthsToAdd)
      end.setDate(end.getDate() - 1) // Subtract 1 day for accurate period

      console.log('Calculated end date:', end)
      setEndDate(end)
    } else {
      setEndDate(null)
    }
  }, [startDate, selectedBillingCycle])

  // Update seats when plan is selected - SEATS COME FROM PLAN
  useEffect(() => {
    if (selectedPlanCard) {
      // Save full plan info to useState
      setSelectedPlanInfo(selectedPlanCard)

      form.setFieldValue('planBillingCycleId', selectedPlanCard.planBillingCycleId)
      form.setFieldValue('maxStudentSeats', selectedPlanCard.maxStudentSeats)
      form.setFieldValue('maxTeacherSeats', selectedPlanCard.maxTeacherSeats)
    } else {
      setSelectedPlanInfo(null)
    }
  }, [selectedPlanCard?.planBillingCycleId]) // Only trigger when actual plan changes

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

      // Set the selected plan in useState
      setSelectedPlanBillingCycleId(subscription.planBillingCycleId)

      // Set start date in useState
      const existingStartDate = subscription.startDate ? new Date(subscription.startDate) : null
      setStartDate(existingStartDate)

      // Set discount in useState
      setDiscountPercent(subscription.discountPercent)

      form.reset({
        planBillingCycleId: subscription.planBillingCycleId,
        startDate: existingStartDate,
        discountPercent: subscription.discountPercent,
        maxStudentSeats: subscription.maxStudentSeats,
        maxTeacherSeats: subscription.maxTeacherSeats,
        curriculumIds: subscription.curriculums.filter((c) => c.id).map((c) => c.id as number)
      })
    }
  }, [subscription, organizationSubscriptionId, plans])

  // Calculate final price with discount
  const calculateFinalPrice = () => {
    if (!selectedPlanInfo) return 0
    return selectedPlanInfo.price * (1 - discountPercent / 100)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-8'
    >
      {/* Header Section */}
      <div className='space-y-1'>
        <h2 className='text-2xl font-bold text-slate-900'>Configure Subscription</h2>
        <p className='text-sm text-slate-500'>
          Select a billing cycle, choose your plan, and configure the subscription details
        </p>
      </div>

      {/* Billing Cycle Selection */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-slate-600' />
          <Label className='text-base font-semibold text-slate-900'>Billing Cycle</Label>
        </div>

        <div className='flex items-center gap-4'>
          <div className='inline-flex rounded-lg bg-slate-100 p-1'>
            <button
              type='button'
              onClick={() => {
                setSelectedBillingCycle(BillingCycle.SEMIANNUAL)
                // Clear plan selection when changing billing cycle
                setSelectedPlanBillingCycleId(0)
                setSelectedPlanInfo(null)
                form.setFieldValue('planBillingCycleId', 0)
              }}
              className={cn(
                'rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200',
                selectedBillingCycle === BillingCycle.SEMIANNUAL
                  ? 'bg-white text-cyan-600 shadow-sm ring-1 ring-cyan-200'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Semiannual
            </button>
            <button
              type='button'
              onClick={() => {
                setSelectedBillingCycle(BillingCycle.ANNUAL)
                // Clear plan selection when changing billing cycle
                setSelectedPlanBillingCycleId(0)
                setSelectedPlanInfo(null)
                form.setFieldValue('planBillingCycleId', 0)
              }}
              className={cn(
                'rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200',
                selectedBillingCycle === BillingCycle.ANNUAL
                  ? 'bg-white text-cyan-600 shadow-sm ring-1 ring-cyan-200'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Annual
            </button>
          </div>
          <div className='flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5'>
            <div className='h-2 w-2 rounded-full bg-blue-500'></div>
            <span className='text-xs font-medium text-blue-700'>
              {selectedBillingCycle === BillingCycle.ANNUAL ? '12 months' : '6 months'} billing period
            </span>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Tag className='h-5 w-5 text-slate-600' />
          <Label className='text-base font-semibold text-slate-900'>
            Select Plan <span className='text-red-500'>*</span>
          </Label>
        </div>

        {planCards.length === 0 ? (
          <Card className='border-2 border-dashed border-slate-200'>
            <CardContent className='p-8 text-center'>
              <p className='text-sm text-slate-500'>
                No plans available for {selectedBillingCycle.toLowerCase()} billing cycle
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {planCards.map((plan) => {
              const isSelected = selectedPlanBillingCycleId === plan.planBillingCycleId

              return (
                <Card
                  key={plan.planBillingCycleId}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-lg',
                    isSelected
                      ? 'border-2 border-blue-500 bg-blue-50/50 shadow-md'
                      : 'border-2 border-slate-200 hover:border-blue-300'
                  )}
                  onClick={() => {
                    setSelectedPlanBillingCycleId(plan.planBillingCycleId)
                  }}
                >
                  <CardContent className='p-5'>
                    <div className='space-y-4'>
                      {/* Header with check */}
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h3 className='text-lg font-bold text-slate-900'>{plan.name}</h3>
                          {plan.description && (
                            <p className='mt-1 line-clamp-2 text-xs text-slate-500'>{plan.description}</p>
                          )}
                        </div>
                        {isSelected && (
                          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500'>
                            <Check className='h-4 w-4 text-white' />
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className='border-t border-slate-200 pt-3'>
                        <div className='flex items-baseline gap-1'>
                          <span className='text-3xl font-bold text-blue-600'>${plan.price.toLocaleString()}</span>
                          <span className='text-sm text-slate-500'>
                            /{selectedBillingCycle === BillingCycle.ANNUAL ? 'year' : '6 months'}
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className='space-y-2 border-t border-slate-200 pt-3'>
                        <div className='flex items-center gap-2 text-sm'>
                          <GraduationCap className='h-4 w-4 text-slate-400' />
                          <span className='text-slate-600'>
                            <span className='font-semibold text-slate-900'>{plan.maxStudentSeats}</span> student seats
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                          <Users className='h-4 w-4 text-slate-400' />
                          <span className='text-slate-600'>
                            <span className='font-semibold text-slate-900'>{plan.maxTeacherSeats}</span> teacher seats
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Configuration Card - Combined Date and Additional Settings */}
      <Card className='border-2 border-slate-200'>
        <CardContent className='p-6'>
          <div className='space-y-6'>
            {/* Subscription Period */}
            <div className='space-y-4'>
              <Label className='text-base font-semibold text-slate-900'>Subscription Period</Label>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <form.AppField name='startDate'>
                  {(field) => (
                    <div className='space-y-2'>
                      <field.DatePickerField
                        label='Start Date'
                        onChange={(date: Date | null) => {
                          setStartDate(date)
                          field.form.setFieldValue('startDate', date)
                        }}
                      />
                    </div>
                  )}
                </form.AppField>

                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-slate-700'>End Date</Label>
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
                    placeholder='Auto-calculated from start date'
                    className='bg-slate-50 text-slate-600'
                  />
                  <p className='text-xs text-slate-500'>
                    Automatically calculated based on start date and billing cycle
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-slate-200'></div>

            {/* Additional Configuration */}
            <div className='space-y-4'>
              <Label className='text-base font-semibold text-slate-900'>Additional Configuration</Label>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <form.AppField name='curriculumIds'>
                  {(field) => <field.DropdownMultipleCheckboxField label='Curriculums' options={curriculumOptions} />}
                </form.AppField>

                <form.AppField name='discountPercent'>
                  {(field) => (
                    <div className='space-y-2'>
                      <field.TextField
                        type='number'
                        label='Discount (%)'
                        min={0}
                        max={100}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = Number(e.target.value)
                          setDiscountPercent(value)
                          field.form.setFieldValue('discountPercent', value)
                        }}
                      />
                      <p className='text-xs text-slate-500'>
                        Applied discount will be shown in the plan overview above
                      </p>
                    </div>
                  )}
                </form.AppField>
              </div>
            </div>

            {/* Plan Overview Display */}
            {selectedPlanInfo && (
              <>
                <div className='border-t border-slate-200'></div>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-base font-semibold text-slate-900'>Plan Overview</Label>
                    <div className='rounded-full bg-blue-100 px-3 py-1'>
                      <span className='text-xs font-medium text-blue-700'>{selectedPlanInfo.name}</span>
                    </div>
                  </div>

                  {/* Plan Details Grid */}
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    {/* Price Info */}
                    <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <p className='text-xs font-medium text-slate-600'>Plan Price</p>
                          <div className='mt-1 flex items-baseline gap-1'>
                            <span
                              className={cn(
                                'text-2xl font-bold',
                                discountPercent > 0 ? 'text-slate-400 line-through' : 'text-blue-600'
                              )}
                            >
                              ${selectedPlanInfo.price.toLocaleString()}
                            </span>
                            <span className='text-xs text-slate-500'>
                              /{selectedBillingCycle === BillingCycle.ANNUAL ? 'year' : '6 months'}
                            </span>
                          </div>
                          {discountPercent > 0 && (
                            <div className='mt-2 space-y-1'>
                              <div className='flex items-center gap-2'>
                                <span className='rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700'>
                                  -{discountPercent}%
                                </span>
                                <span className='text-xs text-slate-500'>
                                  Save ${((selectedPlanInfo.price * discountPercent) / 100).toFixed(2)}
                                </span>
                              </div>
                              <div className='flex items-baseline gap-1'>
                                <p className='text-xs text-green-600'>Final Price:</p>
                                <p className='text-2xl font-bold text-green-700'>
                                  ${calculateFinalPrice().toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100'>
                          <Tag className='h-5 w-5 text-blue-600' />
                        </div>
                      </div>
                    </div>

                    {/* Billing Period */}
                    <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='text-xs font-medium text-slate-600'>Billing Period</p>
                          <p className='mt-1 text-2xl font-bold text-purple-600'>
                            {selectedBillingCycle === BillingCycle.ANNUAL ? '12' : '6'}
                          </p>
                          <p className='text-xs text-slate-500'>months</p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                          <Calendar className='h-5 w-5 text-purple-600' />
                        </div>
                      </div>
                    </div>

                    {/* Student Seats */}
                    <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='text-xs font-medium text-slate-600'>Student Seats</p>
                          <p className='mt-1 text-2xl font-bold text-green-600'>{selectedPlanInfo.maxStudentSeats}</p>
                          <p className='text-xs text-slate-500'>maximum capacity</p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                          <GraduationCap className='h-5 w-5 text-green-600' />
                        </div>
                      </div>
                    </div>

                    {/* Teacher Seats */}
                    <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='text-xs font-medium text-slate-600'>Teacher Seats</p>
                          <p className='mt-1 text-2xl font-bold text-orange-600'>{selectedPlanInfo.maxTeacherSeats}</p>
                          <p className='text-xs text-slate-500'>maximum capacity</p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                          <Users className='h-5 w-5 text-orange-600' />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedPlanInfo.description && (
                    <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
                      <p className='text-xs font-medium text-slate-600'>Plan Description</p>
                      <p className='mt-1 text-sm text-slate-700'>{selectedPlanInfo.description}</p>
                    </div>
                  )}

                  {/* Curriculum Count */}
                  {selectedPlanInfo.curriculumCount > 0 && (
                    <div className='flex items-center gap-2 rounded-md bg-indigo-50 px-4 py-2'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100'>
                        <span className='text-sm font-bold text-indigo-600'>{selectedPlanInfo.curriculumCount}</span>
                      </div>
                      <span className='text-sm font-medium text-slate-700'>Available Curriculums in this plan</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display - Only show if there are actual errors after user interaction */}
      {Object.keys(form.state.errors).length > 0 && form.state.isSubmitted && (
        <Card className='border-2 border-red-200 bg-red-50'>
          <CardContent className='p-4'>
            <h3 className='text-sm font-semibold text-red-800'>Please fix the following errors:</h3>
            <ul className='mt-2 space-y-1 text-sm text-red-700'>
              {Object.entries(form.state.errors).map(([field, errorObj], i) => {
                const message =
                  typeof errorObj === 'string' ? errorObj : (errorObj as any)?.message || JSON.stringify(errorObj)
                return (
                  <li key={i} className='flex items-start gap-2'>
                    <span className='mt-0.5 text-red-500'>•</span>
                    <span>
                      <strong className='font-medium'>{field}:</strong> {message}
                    </span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className='flex items-center justify-between border-t-2 border-slate-200 pt-6'>
        <Button
          type='button'
          variant='outline'
          onClick={() => dispatch(goBack())}
          disabled={currentStep === 1}
          className='px-6'
        >
          Back
        </Button>

        <div className='text-sm font-medium text-slate-600'>
          Step <span className='text-slate-900'>{currentStep}</span> of <span className='text-slate-900'>4</span>
        </div>

        <form.AppForm>
          <form.SubmitButton className='px-6'>
            {isCreating ? (
              <span className='flex items-center gap-2'>
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
                Creating...
              </span>
            ) : (
              'Next'
            )}
          </form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
