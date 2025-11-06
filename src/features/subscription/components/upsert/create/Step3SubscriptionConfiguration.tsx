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
import { Check, Calendar, Users, GraduationCap, Tag, BookOpen } from 'lucide-react'
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
  const { currentStep, organizationSubscriptionId, organizationId, contractId } = useAppSelector(
    (state) => state.organizationSubscriptionForm
  )
  const { data: planData } = useGetAllPlanQuery()
  const { data: curriculumData } = useGetAllCurriculumQuery()
  const { data: subscriptionData } = useGetSubscriptionByIdQuery(organizationSubscriptionId!, {
    skip: !organizationSubscriptionId
  })
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(BillingCycle.ANNUAL)
  const [selectedPlanBillingCycleId, setSelectedPlanBillingCycleId] = useState<number | undefined>(undefined)
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
  const [selectedCurriculumIds, setSelectedCurriculumIds] = useState<number[]>([])

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

  // Get selected curriculums details
  const selectedCurriculums = curriculumData?.data.items.filter((curriculum) =>
    selectedCurriculumIds.includes(curriculum.id)
  )

  const form = useAppForm({
    defaultValues: subscriptionDefaultValues,
    validators: { onChange: subscriptionSchema },
    onSubmit: async ({ value }) => {
      if (!value.planBillingCycleId || value.planBillingCycleId === 0) {
        toast.error('Please select a plan')
        return
      }

      const payload = {
        planBillingCycleId: value.planBillingCycleId,
        contractId: contractId,
        organizationId: organizationId,
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

  // Update seats when plan is selected
  useEffect(() => {
    if (selectedPlanCard) {
      setSelectedPlanInfo(selectedPlanCard)
      form.setFieldValue('planBillingCycleId', selectedPlanCard.planBillingCycleId)
      form.setFieldValue('maxStudentSeats', selectedPlanCard.maxStudentSeats)
      form.setFieldValue('maxTeacherSeats', selectedPlanCard.maxTeacherSeats)
    } else {
      setSelectedPlanInfo(null)
    }
  }, [selectedPlanCard?.planBillingCycleId])

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
      const existingStartDate = subscription.startDate ? new Date(subscription.startDate) : null
      setStartDate(existingStartDate)
      setDiscountPercent(subscription.discountPercent)

      const curriculumIds = subscription.curriculums.filter((c) => c.id).map((c) => c.id as number)
      setSelectedCurriculumIds(curriculumIds)

      form.reset({
        planBillingCycleId: subscription.planBillingCycleId,
        startDate: existingStartDate,
        discountPercent: subscription.discountPercent,
        maxStudentSeats: subscription.maxStudentSeats,
        maxTeacherSeats: subscription.maxTeacherSeats,
        curriculumIds: curriculumIds
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

      {/* Configuration Card */}
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
                        minDate={new Date()}
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

            {/* Curriculum Selection & Details */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5 text-slate-600' />
                <Label className='text-base font-semibold text-slate-900'>Curriculum Selection</Label>
              </div>

              <form.AppField name='curriculumIds'>
                {(field) => (
                  <field.DropdownMultipleCheckboxField
                    label='Select Curriculums'
                    options={curriculumOptions}
                    onChange={(value: string[]) => {
                      const ids = value.map(Number)
                      setSelectedCurriculumIds(ids)
                      field.form.setFieldValue('curriculumIds', ids)
                    }}
                  />
                )}
              </form.AppField>

              {/* Selected Curriculums Display */}
              {selectedCurriculums && selectedCurriculums.length > 0 && (
                <div className='mt-4 space-y-3'>
                  <Label className='text-sm font-medium text-slate-700'>Selected Curriculums</Label>
                  <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                    {selectedCurriculums.map((curriculum) => (
                      <div
                        key={curriculum.id}
                        className='flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3'
                      >
                        {curriculum.imageUrl ? (
                          <img
                            src={curriculum.imageUrl}
                            alt={curriculum.title}
                            className='h-12 w-12 flex-shrink-0 rounded object-cover'
                          />
                        ) : (
                          <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gradient-to-br from-sky-50 to-sky-400'>
                            <GraduationCap className='h-6 w-6 text-blue-500' />
                          </div>
                        )}
                        <div className='flex flex-col'>
                          <p className='font-medium text-slate-900'>{curriculum.title}</p>
                          <p className='text-xs text-slate-500'>
                            {curriculum.courseCount} course{curriculum.courseCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className='border-t border-slate-300'></div>

            {/* Plan Overview Display */}
            {selectedPlanInfo && (
              <>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-base font-semibold text-slate-900'>Plan Overview</Label>
                    <div className='rounded-full bg-blue-100 px-3 py-1'>
                      <span className='text-xs font-medium text-blue-700'>{selectedPlanInfo.name}</span>
                    </div>
                  </div>

                  {/* Plan Details Grid */}
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                </div>
              </>
            )}
            <div className='border-t border-slate-300'></div>

            {/* Discount and Final Price */}
            <div className='space-y-4'>
              <Label className='text-base font-semibold text-slate-900'>Pricing</Label>

              {/* Discount Input */}
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
                  </div>
                )}
              </form.AppField>

              {/* Price Summary */}
              {selectedPlanInfo && (
                <div className='mt-4 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='font-medium text-slate-700'>Total Amount</span>
                    <span className='font-semibold text-slate-900'>${selectedPlanInfo.price.toLocaleString()}</span>
                  </div>

                  <div className='flex justify-between text-sm'>
                    <span className='font-medium text-slate-700'>Discount</span>
                    <span className='font-semibold text-green-600'>
                      {discountPercent > 0 ? `-${discountPercent}%` : '—'}
                    </span>
                  </div>

                  <div className='flex justify-between border-t border-slate-200 pt-2 text-base'>
                    <span className='font-semibold text-slate-900'>Final Amount</span>
                    <span className='font-bold text-blue-600'>${calculateFinalPrice().toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
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
