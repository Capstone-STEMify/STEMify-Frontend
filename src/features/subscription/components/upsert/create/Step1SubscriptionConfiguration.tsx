'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/shadcn/command'
import { Badge } from '@/components/shadcn/badge'
import { CheckIcon, ChevronsUpDown, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
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
import { useParams, useSearchParams } from 'next/navigation'
import { SubscriptionFormData } from '@/features/subscription/types/subscription.type'
import { fileToBase64 } from '@/utils/index'

export default function Step1SubscriptionConfiguration() {
  const searchQuery = useSearchParams()
  const organizationId = searchQuery.get('organizationId')
  const [open, setOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { currentStep, organizationSubscriptionId, contractId } = useAppSelector(
    (state) => state.organizationSubscriptionForm
  )

  const { data: planData } = useGetAllPlanQuery()
  const { data: curriculumData } = useGetAllCurriculumQuery()
  const { data: subscriptionData } = useGetSubscriptionByIdQuery(organizationSubscriptionId!, {
    skip: !organizationSubscriptionId
  })
  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()

  // ✅ Tất cả form state dùng useState
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

  const curriculumOptions =
    curriculumData?.data.items.map((curriculum) => ({
      label: curriculum.title,
      value: String(curriculum.id)
    })) || []

  const selectedCurriculums = curriculumData?.data.items.filter((curriculum) =>
    selectedCurriculumIds.includes(curriculum.id)
  )

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

      // Find and set plan info
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

  // Calculate final price with discount
  const calculateFinalPrice = () => {
    if (!selectedPlanInfo) return 0
    return selectedPlanInfo.price * (1 - discountPercent / 100)
  }

  // ✅ Handle submit với useState
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!selectedPlanBillingCycleId || selectedPlanBillingCycleId === 0) {
      toast.error('Please select a plan')
      return
    }

    if (!startDate) {
      toast.error('Please select a start date')
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

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {/* Header Section */}
      <div className='space-y-1'>
        <h2 className='text-2xl font-bold text-slate-900'>Configure Subscription</h2>
        <p className='text-sm text-slate-500'>
          Select a billing cycle, choose your plan, and configure the subscription details
        </p>
      </div>

      {/* Contract Section */}
      <Card className='border-2 border-slate-200'>
        <CardContent className='space-y-5 p-6'>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold text-slate-900'>Contract Information</h3>
            <p className='text-sm text-slate-500'>Provide contract details and upload a contract file for reference.</p>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {/* Contract Name */}
            <div className='md:col-span-2'>
              <Label className='text-sm font-medium text-slate-700'>Contract Name</Label>
              <Input
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder='Enter contract name'
                className='mt-1'
              />
            </div>

            {/* Contract File Upload */}
            <div>
              <Label className='text-sm font-medium text-slate-700'>Contract File (PDF)</Label>
              <input
                type='file'
                accept='.pdf'
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setContractFile(file)
                }}
                className='mt-1 block w-full cursor-pointer rounded-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-blue-100 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-blue-600 hover:bg-slate-100'
              />
              <p className='mt-1 text-[11px] text-slate-500'>Upload a small PDF (under 5MB)</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className='text-sm font-medium text-slate-700'>Description</Label>
            <textarea
              value={contractDescription}
              onChange={(e) => setContractDescription(e.target.value)}
              placeholder='Enter contract description'
              rows={3}
              className='mt-1 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
            />
          </div>
        </CardContent>
      </Card>

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
                    setSelectedPlanInfo(plan)
                    setMaxStudentSeats(plan.maxStudentSeats)
                    setMaxTeacherSeats(plan.maxTeacherSeats)
                  }}
                >
                  <CardContent className='p-5'>
                    <div className='space-y-4'>
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

                      <div className='border-t border-slate-200 pt-3'>
                        <div className='flex items-baseline gap-1'>
                          <span className='text-3xl font-bold text-blue-600'>${plan.price.toLocaleString()}</span>
                          <span className='text-sm text-slate-500'>
                            /{selectedBillingCycle === BillingCycle.ANNUAL ? 'year' : '6 months'}
                          </span>
                        </div>
                      </div>

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
                <div className='space-y-2'>
                  <Label className='text-sm font-medium text-slate-700'>Start Date</Label>
                  <Input
                    type='date'
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

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

            <div className='border-t border-slate-200'></div>

            {/* Curriculum Selection */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5 text-slate-600' />
                <Label className='text-base font-semibold text-slate-900'>Curriculum Selection</Label>
              </div>

              <div className='space-y-2'>
                <Label className='text-sm font-medium text-slate-700'>Select Curriculums</Label>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='h-auto min-h-[40px] w-full justify-between py-2'
                    >
                      {selectedCurriculumIds.length > 0 ? (
                        <div className='flex flex-wrap gap-1'>
                          {selectedCurriculumIds.map((id) => {
                            const curriculum = curriculumData?.data.items.find((c) => c.id === id)
                            return curriculum ? (
                              <Badge
                                key={id}
                                variant='secondary'
                                className='mr-1 mb-1'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedCurriculumIds(selectedCurriculumIds.filter((cId) => cId !== id))
                                }}
                              >
                                {curriculum.title}
                                <X className='ml-1 h-3 w-3 cursor-pointer' />
                              </Badge>
                            ) : null
                          })}
                        </div>
                      ) : (
                        <span className='text-slate-500'>Select curriculums...</span>
                      )}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0' align='start'>
                    <Command>
                      <CommandInput placeholder='Search curriculum...' />
                      <CommandEmpty>No curriculum found.</CommandEmpty>
                      <CommandGroup className='max-h-64 overflow-auto'>
                        {curriculumData?.data.items.map((curriculum) => {
                          const isSelected = selectedCurriculumIds.includes(curriculum.id)
                          return (
                            <CommandItem
                              key={curriculum.id}
                              onSelect={() => {
                                if (isSelected) {
                                  setSelectedCurriculumIds(selectedCurriculumIds.filter((id) => id !== curriculum.id))
                                } else {
                                  setSelectedCurriculumIds([...selectedCurriculumIds, curriculum.id])
                                }
                              }}
                              className='cursor-pointer'
                            >
                              <div className='flex flex-1 items-center gap-2'>
                                <div
                                  className={cn(
                                    'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                    isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                                  )}
                                >
                                  <CheckIcon className='h-4 w-4' />
                                </div>
                                {curriculum.imageUrl ? (
                                  <img
                                    src={curriculum.imageUrl}
                                    alt={curriculum.title}
                                    className='h-8 w-8 rounded object-cover'
                                  />
                                ) : (
                                  <div className='flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-sky-100 to-sky-300'>
                                    <GraduationCap className='h-4 w-4 text-blue-600' />
                                  </div>
                                )}
                                <div className='flex flex-col'>
                                  <span className='text-sm font-medium'>{curriculum.title}</span>
                                  <span className='text-xs text-slate-500'>
                                    {curriculum.courseCount} course{curriculum.courseCount !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedCurriculumIds.length > 0 && (
                  <p className='mt-1 text-xs text-slate-500'>
                    {selectedCurriculumIds.length} curriculum{selectedCurriculumIds.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {/* Selected Curriculums Display */}
              {selectedCurriculums && selectedCurriculums.length > 0 && (
                <div className='mt-4 space-y-3'>
                  <Label className='text-sm font-medium text-slate-700'>Selected Curriculums</Label>
                  <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                    {selectedCurriculums.map((curriculum) => (
                      <div
                        key={curriculum.id}
                        className='group relative flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3'
                      >
                        {/* Remove button */}
                        <button
                          type='button'
                          onClick={() =>
                            setSelectedCurriculumIds(selectedCurriculumIds.filter((id) => id !== curriculum.id))
                          }
                          className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600'
                        >
                          <X className='h-3 w-3' />
                        </button>

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

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='text-xs font-medium text-slate-600'>Student Seats</p>
                          <p className='mt-1 text-2xl font-bold text-green-600'>{maxStudentSeats}</p>
                          <p className='text-xs text-slate-500'>maximum capacity</p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                          <GraduationCap className='h-5 w-5 text-green-600' />
                        </div>
                      </div>
                    </div>

                    <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4'>
                      <div className='flex items-start justify-between'>
                        <div>
                          <p className='text-xs font-medium text-slate-600'>Teacher Seats</p>
                          <p className='mt-1 text-2xl font-bold text-orange-600'>{maxTeacherSeats}</p>
                          <p className='text-xs text-slate-500'>maximum capacity</p>
                        </div>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                          <Users className='h-5 w-5 text-orange-600' />
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedPlanInfo.description && (
                    <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
                      <p className='text-xs font-medium text-slate-600'>Plan Description</p>
                      <p className='mt-1 text-sm text-slate-700'>{selectedPlanInfo.description}</p>
                    </div>
                  )}
                </div>
                <div className='border-t border-slate-300'></div>
              </>
            )}

            {/* Discount and Final Price */}
            <div className='space-y-4'>
              <Label className='text-base font-semibold text-slate-900'>Pricing</Label>

              <div className='space-y-2'>
                <Label className='text-sm font-medium text-slate-700'>Discount (%)</Label>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                />
              </div>

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

        <Button type='submit' className='px-6' disabled={isCreating}>
          {isCreating ? (
            <span className='flex items-center gap-2'>
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
              Creating...
            </span>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </form>
  )
}
