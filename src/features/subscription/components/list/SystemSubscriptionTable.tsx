import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSystemSubscriptionColumn } from '@/features/subscription/components/list/SystemSubscriptionColumn'
import { OrganizationSubscription } from '@/features/subscription/types/subscription.type'
import { Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
type SystemSubscriptionTableProps = {
  subscription: OrganizationSubscription[]
}
export default function SystemSubscriptionTable({ subscription }: SystemSubscriptionTableProps) {
  const router = useRouter()
  const locale = useLocale()
  const to = useTranslations('organization.subscription')
  const tc = useTranslations('common')
  const columns = useSystemSubscriptionColumn()

  const { organizationId } = useParams()
  return (
    <div className='space-y-3 py-8'>
      <div className='flex justify-between'>
        <h2 className='text-lg font-semibold'>{to('title')}</h2>

        <Button
          size='sm'
          onClick={() => {
            router.push(`/${locale}/admin/organization/${organizationId}/create-subscription`)
          }}
        >
          <Plus className='h-4 w-4' />
          <p>{tc('button.createSubscription')}</p>
        </Button>
      </div>
      <DataTable data={subscription} columns={columns} enableRowSelection={false} />
    </div>
  )
}
