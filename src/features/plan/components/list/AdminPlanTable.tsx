'use client'

import { Fragment, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { BillingCycle, Plan, PlanPricingTier } from '@/features/plan/types/plan.type'
import { formatDate } from '@/utils/index'
import AdminPricingTierTable from '@/features/plan/components/list/AdminPricingTierTable'
import SSheet from '@/components/shared/SSheet'
import CreateSubscriptionPlanSheet from '@/features/plan/components/sheet/CreateSubscriptionPlanSheet'

const plans: (Plan & { pricingTiers: PlanPricingTier[] })[] = [
  {
    id: '1',
    name: 'Stemify Basic',
    description: 'Entry-level plan for small organizations.',
    accessSupportDetail: 'Email support',
    curriculumCount: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    pricingTiers: [
      { id: 't1', planId: '1', billingCycle: BillingCycle.SIXMONTHS, minSeat: 1, maxSeat: 100, pricePerSeat: 10 },
      { id: 't2', planId: '1', billingCycle: BillingCycle.SIXMONTHS, minSeat: 101, maxSeat: 500, pricePerSeat: 9 },
      { id: 't3', planId: '1', billingCycle: BillingCycle.TWELVEMONTHS, minSeat: 1, maxSeat: 100, pricePerSeat: 8 },
      { id: 't4', planId: '1', billingCycle: BillingCycle.TWELVEMONTHS, minSeat: 101, maxSeat: 500, pricePerSeat: 7 }
    ]
  },
  {
    id: '2',
    name: 'Stemify Pro',
    description: 'Designed for medium-sized institutions.',
    accessSupportDetail: 'Priority email support',
    curriculumCount: 50,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    pricingTiers: [
      { id: 't5', planId: '2', billingCycle: BillingCycle.SIXMONTHS, minSeat: 1, maxSeat: 100, pricePerSeat: 20 },
      { id: 't6', planId: '2', billingCycle: BillingCycle.SIXMONTHS, minSeat: 101, maxSeat: 500, pricePerSeat: 18 },
      { id: 't7', planId: '2', billingCycle: BillingCycle.TWELVEMONTHS, minSeat: 1, maxSeat: 100, pricePerSeat: 17 },
      { id: 't8', planId: '2', billingCycle: BillingCycle.TWELVEMONTHS, minSeat: 101, maxSeat: 500, pricePerSeat: 15 }
    ]
  },
  {
    id: '3',
    name: 'Stemify Premium',
    description: 'Enterprise solution for large organizations.',
    accessSupportDetail: '24/7 dedicated support',
    curriculumCount: 100,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    pricingTiers: [
      { id: 't9', planId: '3', billingCycle: BillingCycle.SIXMONTHS, minSeat: 1, maxSeat: 200, pricePerSeat: 30 },
      { id: 't10', planId: '3', billingCycle: BillingCycle.SIXMONTHS, minSeat: 201, maxSeat: 1000, pricePerSeat: 28 },
      { id: 't11', planId: '3', billingCycle: BillingCycle.TWELVEMONTHS, minSeat: 1, maxSeat: 200, pricePerSeat: 25 },
      {
        id: 't12',
        planId: '3',
        billingCycle: BillingCycle.TWELVEMONTHS,
        minSeat: 201,
        maxSeat: 1000,
        pricePerSeat: 22
      }
    ]
  }
]

export default function AdminPlanTable() {
  const [expandedPlans, setExpandedPlans] = useState<string[]>([])

  const toggleExpand = (planId: string) => {
    setExpandedPlans((prev) => (prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]))
  }

  return (
    <div className='my-5 px-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground text-3xl font-bold'>Plan Management</h1>
            <p className='text-muted-foreground mt-1'>Manage subscription plans and pricing tiers</p>
          </div>
          <CreateSubscriptionPlanSheet />
        </div>

        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'></TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Curriculums</TableHead>
                <TableHead>Support</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <Fragment key={plan.id}>
                  <TableRow className='cursor-pointer' onClick={() => toggleExpand(plan.id)}>
                    <TableCell>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        {expandedPlans.includes(plan.id) ? (
                          <ChevronDown className='h-4 w-4' />
                        ) : (
                          <ChevronRight className='h-4 w-4' />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className='font-medium'>{plan.name}</TableCell>
                    <TableCell className='max-w-xs truncate'>{plan.description}</TableCell>
                    <TableCell>
                      <Badge className='bg-emerald-700 text-white'>{plan.curriculumCount}</Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>{plan.accessSupportDetail}</TableCell>
                    <TableCell className='text-muted-foreground text-sm'>{formatDate(plan.updatedAt)}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('[v0] Edit plan:', plan.id)
                          }}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-destructive hover:text-destructive h-8 w-8 p-0'
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('[v0] Delete plan:', plan.id)
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedPlans.includes(plan.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className='bg-muted/30 p-0'>
                        <AdminPricingTierTable plan={plan} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
