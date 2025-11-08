'use client'

import { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Pencil, Trash2, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react'
import { formatDate } from '@/utils/index'
import AdminPricingTierTable from '@/features/plan/components/list/AdminPricingTierTable'
import CreateSubscriptionPlanSheet from '@/features/plan/components/sheet/CreateSubscriptionPlanSheet'
import { useDeletePlanMutation, useSearchPlanQuery, useUpdatePlanMutation } from '@/features/plan/api/planApi'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setPageIndex, setParam } from '@/features/plan/slice/planProductSlice'
import SSelect from '@/components/shared/SSelect'
import { PlanStatus } from '@/features/plan/types/plan.type'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import Loading from 'app/[locale]/loading'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SPagination } from '@/components/shared/SPagination'

export default function AdminPlanTable() {
  const { openModal } = useModal()
  const [expandedPlans, setExpandedPlans] = useState<number[]>([])
  const dispatch = useAppDispatch()

  const planSliceParams = useAppSelector((state) => state.plan)

  const { data, isFetching } = useSearchPlanQuery(planSliceParams)
  const [deletePlan] = useDeletePlanMutation()
  const [updatePlan] = useUpdatePlanMutation()
  const toggleExpand = (planId: number) => {
    setExpandedPlans((prev) => (prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]))
  }

  useEffect(() => {
    resetParams()
  }, [])

  const statusOptions = Object.entries(PlanStatus).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
    value: value
  }))

  const handlePublishPlan = (planId: number) => {
    // Implement publish plan logic here
    updatePlan({ id: planId, body: { status: PlanStatus.PUBLISHED } }).unwrap()
    dispatch(setParam({ key: 'status', value: PlanStatus.PUBLISHED }))
    toast.success('Plan published successfully')
  }
  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  if (isFetching || !data) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingComponent />
      </div>
    )
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
          <div className='flex gap-4'>
            <SSelect
              placeholder='status'
              value={planSliceParams.status?.toString() ?? ''}
              onChange={(val) => dispatch(setParam({ key: 'status', value: val as PlanStatus }))}
              options={statusOptions}
            />
            <Button onClick={() => openModal('upsertPlan')} className='bg-blue-500'>
              Create New Plan
            </Button>
          </div>

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
              {plans.length > 0 ? (
                plans.map((plan) => (
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              {plan.status != PlanStatus.ARCHIVED && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openModal('upsertPlan', { planId: plan.id })
                                  }}
                                >
                                  Update
                                </DropdownMenuItem>
                              )}
                              {plan.status == PlanStatus.DRAFT && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handlePublishPlan(plan.id)
                                  }}
                                >
                                  Publish
                                </DropdownMenuItem>
                              )}
                              {plan.status == PlanStatus.DRAFT && (
                                <DropdownMenuItem
                                  className='text-red-500 hover:bg-red-100'
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
                                  Delete
                                </DropdownMenuItem>
                              )}
                              {plan.status == PlanStatus.PUBLISHED && (
                                <DropdownMenuItem
                                  className='text-yellow-600'
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openModal('confirm', {
                                      message: 'Are you sure you want to archive this plan?',
                                      onConfirm: async () => {
                                        await deletePlan(plan.id)
                                        toast.success('Plan archived successfully')
                                      }
                                    })
                                  }}
                                >
                                  Archive
                                </DropdownMenuItem>
                              )}

                              {plan.status == PlanStatus.ARCHIVED && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updatePlan({ id: plan.id, body: { status: PlanStatus.PUBLISHED } }).unwrap()
                                    toast.success('Plan restored successfully')
                                  }}
                                >
                                  Restore
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='text-muted-foreground py-4 text-center'>
                    No plans available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {data?.data?.totalPages > 1 && (
          <SPagination
            pageNumber={planSliceParams.pageNumber!}
            totalPages={data.data.totalPages}
            onPageChanged={handlePageChange}
            className='pb-6'
          />
        )}
      </div>
    </div>
  )
}
