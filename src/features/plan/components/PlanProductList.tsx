'use client'

import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useSearchPlanProductQuery } from '@/features/plan/api/planApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { clsx } from 'clsx'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function UpgradePlanPage() {
  const t = useTranslations('plan.list')
  const planProductParams = useAppSelector((state) => state.planProduct)
  const { data: planProductData, isLoading } = useSearchPlanProductQuery(planProductParams)

  if (isLoading) {
    return <LoadingComponent />
  }

  if (!planProductData || planProductData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDescription')} />
  }

  return (
    <div className='mx-auto max-w-6xl px-6 py-12'>
      <h1 className='mb-12 text-center text-5xl font-bold tracking-tight'>{t('title')}</h1>

      <div className='mb-12 flex justify-center gap-6'>
        <Button variant='secondary' className='px-8 py-2 text-base font-medium'>
          Personal
        </Button>
        <Button variant='outline' className='px-8 py-2 text-base font-medium'>
          Business
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        {planProductData.data.items.map((plan) => {
          // Chuẩn hoá description
          const features =
            typeof plan.description === 'string'
              ? plan.description.split('\n').filter((line) => line.trim() !== '')
              : Array.isArray(plan.description)
                ? plan.description
                : []

          return (
            <Card
              key={plan.id}
              className={clsx(
                'h-full min-h-[28rem] rounded-3xl border p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl',
                plan.id == 1 &&
                  'border-sky-custom-400 ring-sky-custom-300 bg-gradient-to-br from-white via-sky-50/5 to-sky-50 ring-2'
              )}
            >
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <div className='space-y-2'>
                    <div className='text-3xl font-semibold'>{plan.name}</div>

                    {plan.pricePerSeat && (
                      <div className='text-muted-foreground text-sm line-through'>${plan.pricePerSeat}</div>
                    )}

                    <div className='text-sky-custom-600 text-5xl font-bold'>
                      ${plan.pricePerSeat}
                      <span className='text-muted-foreground text-sm font-normal'> / {t('month')}</span>
                    </div>
                  </div>

                  {plan.id == 1 && (
                    <Badge className='bg-sky-custom-100 text-sky-custom-600 rounded-md px-3 py-1 text-xs font-semibold'>
                      {t('recommended')}
                    </Badge>
                  )}

                  {/* {plan.isCurrent && (
                    <div className='bg-muted text-muted-foreground rounded-md px-3 py-1 text-xs'>Your current plan</div>
                  )} */}
                </CardTitle>
              </CardHeader>

              <CardContent className='flex flex-grow flex-col space-y-4 pt-6'>
                <div className='flex-grow space-y-4'>
                  {features.length > 0 ? (
                    features.map((feat, i) => (
                      <div key={i} className='flex items-start gap-3 text-sm'>
                        <CheckCircle2 className='mt-0.5 h-4 w-4 text-green-500' />
                        <span>{feat}</span>
                      </div>
                    ))
                  ) : (
                    <p className='text-muted-foreground text-sm'>No feature description provided.</p>
                  )}
                </div>

                <div>
                  <Button className='bg-sky-custom-600 hover:bg-sky-custom-700 w-full rounded-3xl py-6 text-base font-medium'>
                    {t('choosePlanBtn')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
