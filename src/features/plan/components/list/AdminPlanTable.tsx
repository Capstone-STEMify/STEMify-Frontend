'use client'

import { Fragment, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { formatDate } from '@/utils/index'
import AdminPricingTierTable from '@/features/plan/components/list/AdminPricingTierTable'
import CreateSubscriptionPlanSheet from '@/features/plan/components/sheet/CreateSubscriptionPlanSheet'
import { useDeletePlanMutation, useSearchPlanQuery } from '@/features/plan/api/planApi'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'

export default function AdminPlanTable() {
  const { openModal } = useModal()
  const [expandedPlans, setExpandedPlans] = useState<number[]>([])
  const { data } = useSearchPlanQuery({ pageNumber: 1, pageSize: 20 })
  const [deletePlan] = useDeletePlanMutation()
  const toggleExpand = (planId: number) => {
    setExpandedPlans((prev) => (prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]))
  }
  const plans = data?.data.items || []
  return (
    <div className='my-5 px-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground text-3xl font-bold'>Plan Management</h1>
            <p className='text-muted-foreground mt-1'>Manage subscription plans and pricing tiers</p>
          </div>
          <Button onClick={() => openModal('upsertPlan')} className='bg-blue-500'>
            Create New Plan
          </Button>

          {/* <CreateSubscriptionPlanSheet /> */}
        </div>

        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'></TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Curriculums</TableHead>
                <TableHead>Created Date</TableHead>
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
                    <TableCell className='text-muted-foreground text-sm'>{formatDate(plan.createdAt)}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal('upsertPlan', { planId: plan.id })
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
                            openModal('confirm', {
                              message: 'Are you sure you want to delete this plan?',
                              onConfirm: async () => {
                                await deletePlan(plan.id)
                                toast.success('Plan deleted successfully')
                              }
                            })
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedPlans.includes(plan.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className='bg-slate-50 p-0'>
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
