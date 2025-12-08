'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Check, Router } from 'lucide-react'
import { formatPrice } from '@/utils/index'
import { BillingCycle, Plan } from '@/features/plan/types/plan.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { containerVariants, itemVariants } from '@/utils/motion'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

interface SubscriptionPlanProps {
  plans: Plan[]
}

export function SubscriptionPlan({ plans }: SubscriptionPlanProps) {
  const t = useTranslations('plan.user')
  const tc = useTranslations('common.button')
  const router = useRouter()
  const locale = useLocale()
  const billingCycle = useAppSelector((state) => state.plan.billingCycle)

  const getPrice = (plan: Plan) => {
    const cycle = plan.planBillingCycles.find((c) => c.billingCycle === billingCycle)
    return cycle ? cycle.price : 0
  }

  return (
    <div className='space-y-12'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='grid gap-10 md:grid-cols-3'
      >
        {plans.map((plan, index) => {
          const price = getPrice(plan)
          const isPopular = index === 1

          return (
            <motion.div key={plan.id} variants={itemVariants}>
              <Card
                className={`relative flex h-full flex-col overflow-hidden border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-2 hover:ring-sky-400 ${
                  isPopular ? 'shadow-lg' : 'shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Badge */}
                {isPopular && (
                  <div className='absolute top-4 right-4 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-3 py-1 text-xs font-semibold text-white shadow-md'>
                    {t('popular')}
                  </div>
                )}

                <div className={`flex flex-1 flex-col p-8 ${isPopular ? 'pt-12' : ''}`}>
                  {/* Header */}
                  <div className='mb-6'>
                    <h3 className='mb-2 text-2xl font-bold text-slate-900'>{plan.name}</h3>
                    <p className='text-sm text-slate-500'>{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className='mb-8'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-3xl font-extrabold text-slate-900'>{formatPrice(price)}</span>
                      <span className='text-slate-500'>
                        /{billingCycle === BillingCycle.ANNUAL ? 'year' : '6 months'}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => router.push(`/${locale}/contact`)}
                    className={`mb-8 w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 py-5 font-semibold text-white shadow-md transition-transform duration-300 hover:scale-[1.02]`}
                  >
                    {tc('contact')}
                  </Button>

                  {/* Features */}
                  <div className='mb-8 space-y-4'>
                    <FeatureItem
                      icon={<Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-sky-500' />}
                      title={`${plan.maxTeacherSeats} Teacher Seats`}
                      subtitle='For educators'
                    />
                    <FeatureItem
                      icon={<Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-sky-500' />}
                      title={`${plan.maxStudentSeats} Student Seats`}
                      subtitle='For learners'
                    />
                    <FeatureItem
                      icon={<Check className='mt-0.5 h-5 w-5 flex-shrink-0 text-sky-500' />}
                      title={`${plan.curriculumCount} Curriculums`}
                      subtitle='STEM programs included'
                    />
                  </div>

                  {/* Support */}
                  <div className='mt-auto border-t border-slate-200 pt-6'>
                    <p className='mb-3 text-xs font-semibold tracking-wide text-slate-700 uppercase'>
                      Support & Access
                    </p>
                    <div className='space-y-2 text-sm text-slate-600'>
                      {plan.accessSupportDetail.split('\n').map((line, idx) => (
                        <p key={idx} className='flex items-center gap-2'>
                          <span className='font-bold text-indigo-500'>•</span>
                          <span>{line.replace('• ', '')}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

function FeatureItem({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className='flex items-start gap-3'>
      {icon}
      <div>
        <p className='font-semibold text-slate-800'>{title}</p>
        <p className='text-sm text-slate-500'>{subtitle}</p>
      </div>
    </div>
  )
}
