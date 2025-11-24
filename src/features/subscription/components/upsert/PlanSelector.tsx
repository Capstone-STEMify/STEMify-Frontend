'use client'
import { Card, CardContent } from '@/components/shadcn/card'
import { Label } from '@/components/shadcn/label'
import { Tag, GraduationCap, Users, Check, Book } from 'lucide-react'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { cn } from '@/utils/shadcn/utils'
import { useTranslations } from 'next-intl'

interface PlanCardData {
  id: number
  name: string
  description: string
  maxStudentSeats: number
  maxTeacherSeats: number
  curriculumCount: number
  price: number
  planBillingCycleId: number
  curriculums: any[]
}

interface PlanSelectorProps {
  planCards: PlanCardData[]
  selectedPlanBillingCycleId: number
  selectedBillingCycle: BillingCycle
  onPlanSelect: (plan: PlanCardData) => void
}

export default function PlanSelector({
  planCards,
  selectedPlanBillingCycleId,
  selectedBillingCycle,
  onPlanSelect
}: PlanSelectorProps) {
  const to = useTranslations('organization.subscription.create')
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Tag className='h-5 w-5 text-slate-600' />
        <Label className='text-base font-semibold text-slate-900'>
          {to('plan.label')} <span className='text-red-500'>*</span>
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
                onClick={() => onPlanSelect(plan)}
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
                        <span className='text-3xl font-bold text-blue-600'>{plan.price.toLocaleString()} VND</span>
                        <span className='text-sm text-slate-500'>
                          /{selectedBillingCycle === BillingCycle.ANNUAL ? to('plan.annual') : to('plan.semiAnnual')}
                        </span>
                      </div>
                    </div>

                    <div className='space-y-2 border-t border-slate-200 pt-3'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Book className='h-4 w-4 text-slate-400' />
                        <span className='text-slate-600'>
                          <span className='font-semibold text-slate-900'>{plan.curriculumCount}</span>{' '}
                          {to('plan.curriculum')}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <GraduationCap className='h-4 w-4 text-slate-400' />
                        <span className='text-slate-600'>
                          <span className='font-semibold text-slate-900'>{plan.maxStudentSeats}</span>{' '}
                          {to('plan.studentSeat')}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <Users className='h-4 w-4 text-slate-400' />
                        <span className='text-slate-600'>
                          <span className='font-semibold text-slate-900'>{plan.maxTeacherSeats}</span>{' '}
                          {to('plan.teacherSeat')}
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
  )
}
