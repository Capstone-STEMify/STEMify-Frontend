'use client'

import { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { ChevronDown, ChevronRight, Edit2, MoreHorizontal } from 'lucide-react'
import { formatDate } from '@/utils/index'
import AdminPricingTierTable from '@/features/plan/components/list/AdminPricingTierTable'
import { useDeletePlanMutation, useSearchPlanQuery, useUpdatePlanMutation } from '@/features/plan/api/planApi'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setPageIndex, setParam } from '@/features/plan/slice/planProductSlice'
import SSelect from '@/components/shared/SSelect'
import { PlanStatus } from '@/features/plan/types/plan.type'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SPagination } from '@/components/shared/SPagination'
import SStatusDropdown from '@/components/shared/SStatusDropdown'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { useLocale, useTranslations } from 'next-intl'
import { title } from 'process'

export default function AdminPlanTable() {
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const tp = useTranslations('plan')

  const locale = useLocale()

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

  const statusOptions = [
    { label: 'All', value: 'all' },
    ...Object.entries(PlanStatus).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value
    }))
  ]

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

  const planStatusOptions = [
    { label: 'Draft', value: PlanStatus.DRAFT },
    { label: 'Published', value: PlanStatus.PUBLISHED },
    { label: 'Archived', value: PlanStatus.ARCHIVED },
    { label: 'Deleted', value: PlanStatus.DELETED } // For frontend usage only
  ]

  const PlanStatusFlow: Record<PlanStatus, PlanStatus[]> = {
    [PlanStatus.DRAFT]: [PlanStatus.DRAFT, PlanStatus.PUBLISHED],
    [PlanStatus.PUBLISHED]: [PlanStatus.PUBLISHED, PlanStatus.ARCHIVED],
    [PlanStatus.ARCHIVED]: [PlanStatus.PUBLISHED, PlanStatus.ARCHIVED],
    [PlanStatus.DELETED]: []
  }

  const handleStatusChange = (plan: any, newStatus: string) => {
    if (newStatus === PlanStatus.DELETED) {
      openModal('confirm', {
        message: tt('confirmMessage.delete', { title: plan.name }),
        onConfirm: async () => {
          await deletePlan(plan.id)
          toast.success(tt('successMessage.delete'))
        }
      })
      return
    }

    updatePlan({ id: plan.id, body: { status: newStatus as PlanStatus } })
      .unwrap()
      .then(() => toast.success(tt('successMessage.update', { title: newStatus })))
  }

  const handlePublishPlan = (planId: number) => {
    // Implement publish plan logic here
    updatePlan({ id: planId, body: { status: PlanStatus.PUBLISHED } }).unwrap()
    dispatch(setParam({ key: 'status', value: PlanStatus.PUBLISHED }))
    toast.success('Plan published successfully')
  }

  return (
    <div className='my-5 px-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground'>{tp('list.header')}</h1>
            <p className='text-muted-foreground mt-1'>{tp('list.headerDescription')}</p>
          </div>
          <div className='flex gap-4'>
            <SSelect
              placeholder={tc('status.statusLabel')}
              value={planSliceParams.status?.toString() ?? ''}
              onChange={(val) => {
                if (val === 'all') {
                  dispatch(setParam({ key: 'status', value: undefined }))
                } else {
                  dispatch(setParam({ key: 'status', value: val as PlanStatus }))
                }
              }}
              options={statusOptions.filter((opt) => opt.value !== PlanStatus.DELETED)}
            />
            <Button onClick={() => openModal('upsertPlan')} className='bg-blue-500'>
              {tc('button.createPlan')}
            </Button>
          </div>

          {/* <CreateSubscriptionPlanSheet /> */}
        </div>

        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'></TableHead>
                <TableHead>{tc('tableHeader.planName')}</TableHead>
                <TableHead>{tc('tableHeader.description')}</TableHead>
                <TableHead>{tc('tableHeader.status')}</TableHead>
                <TableHead>{tc('tableHeader.curriculums')}</TableHead>
                <TableHead>{tc('tableHeader.createdAt')}</TableHead>
                <TableHead>{tc('tableHeader.action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.length > 0 ? (
                plans.map((plan) => {
                  const allowedOptions = planStatusOptions.filter((opt) =>
                    PlanStatusFlow[plan.status].includes(opt.value as PlanStatus)
                  )
                  return (
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
                        <TableCell className='max-w-72 truncate'>{plan.description}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <SStatusDropdown
                            value={plan.status}
                            options={allowedOptions}
                            onChange={(newStatus) => handleStatusChange(plan, newStatus)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge className='bg-emerald-700 text-white'>{plan.curriculumCount}</Badge>
                        </TableCell>
                        <TableCell className='text-muted-foreground text-sm'>
                          {formatDate(plan.createdAt, { locale: locale as 'en' | 'vi' })}
                        </TableCell>
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
                                    {tp('update')}
                                  </DropdownMenuItem>
                                )}

                                {plan.status == PlanStatus.DRAFT && (
                                  <DropdownMenuItem
                                    className='text-red-500 hover:bg-red-100'
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openModal('confirm', {
                                        message: tt('confirmMessage.delete', { title: plan.name }),
                                        onConfirm: async () => {
                                          await deletePlan(plan.id)
                                          toast.success(tt('successMessage.delete'))
                                        }
                                      })
                                    }}
                                  >
                                    {tp('delete')}
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
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='text-muted-foreground py-4 text-center'>
                    {tp('list.noData')}
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
