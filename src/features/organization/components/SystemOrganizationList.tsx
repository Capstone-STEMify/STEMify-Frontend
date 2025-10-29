'use client'

import { Fragment, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { useDeletePlanMutation, useSearchPlanQuery } from '@/features/plan/api/planApi'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useDeleteOrganizationMutation, useSearchOrganizationsQuery } from '@/features/organization/api/organizationApi'
import Image from 'next/image'
import { formatDate } from '@/utils/index'
import SystemSubscriptionTable from '@/features/subscription/components/list/SystemSubscriptionTable'

export default function SystemOrganizationList() {
  const t = useTranslations('subscription')
  const tc = useTranslations('common')
  const tList = useTranslations('curriculum.list')
  const router = useRouter()
  const locale = useLocale()

  const { openModal } = useModal()
  const [expandedOrganizations, setExpandedOrganizations] = useState<number[]>([])
  const { data } = useSearchOrganizationsQuery({ pageNumber: 1, pageSize: 20 })
  const [deleteOrganization] = useDeleteOrganizationMutation()
  const toggleExpand = (organizationId: number) => {
    setExpandedOrganizations((prev) =>
      prev.includes(organizationId) ? prev.filter((id) => id !== organizationId) : [...prev, organizationId]
    )
  }
  const organizations = data?.data.items || []
  return (
    <div className='my-5 px-10'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='mt-4 mb-4 text-3xl font-bold'>{t('list.organizationSubscriptionTitle')}</h1>
            <p className='text-muted-foreground mt-1'>{t('list.organizationSubscriptionDescription')}</p>
          </div>
          <Button className='bg-sky-500' onClick={() => router.push(`/${locale}/admin/subscription/create`)}>
            + {tc('button.create')}
          </Button>
        </div>

        <div className='border-border overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'></TableHead>
                <TableHead>{tc('tableHeader.image')}</TableHead>
                <TableHead>{tc('tableHeader.name')}</TableHead>
                <TableHead>{tc('tableHeader.organizationType')}</TableHead>
                <TableHead>{tc('tableHeader.status')}</TableHead>
                <TableHead>{tc('tableHeader.createdDate')}</TableHead>
                <TableHead>{tc('tableHeader.lastModified')}</TableHead>
                <TableHead className='text-center'>{tc('tableHeader.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((organization) => (
                <Fragment key={organization.id}>
                  <TableRow className='cursor-pointer' onClick={() => toggleExpand(organization.id)}>
                    <TableCell>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        {expandedOrganizations.includes(organization.id) ? (
                          <ChevronDown className='h-4 w-4' />
                        ) : (
                          <ChevronRight className='h-4 w-4' />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className='font-medium'>
                      <div className='h-12 w-12 overflow-hidden rounded-full'>
                        <Image
                          src={organization.imageUrl}
                          alt={organization.name}
                          width={56}
                          height={56}
                          className='h-full w-full rounded-full object-cover'
                        />
                      </div>
                    </TableCell>

                    <TableCell className='font-medium'>{organization.name}</TableCell>
                    <TableCell>{organization.organizationType}</TableCell>
                    <TableCell>
                      <Badge className='bg-emerald-700 text-white'>{organization.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(organization.createdDate)}</TableCell>
                    <TableCell>{formatDate(organization.lastModifiedDate)}</TableCell>

                    <TableCell>
                      <div className='flex items-center justify-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal('upsertPlan', { planId: organization.id })
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
                              message: 'Are you sure you want to delete this organization?',
                              onConfirm: async () => {
                                await deleteOrganization(organization.id)
                                toast.success('Organization deleted successfully')
                              }
                            })
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedOrganizations.includes(organization.id) && (
                    <TableRow>
                      <TableCell colSpan={8} className='bg-muted/30 p-0'>
                        <SystemSubscriptionTable organization={organization} />
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
