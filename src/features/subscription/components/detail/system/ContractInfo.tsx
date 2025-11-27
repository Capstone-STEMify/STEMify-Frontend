'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Button } from '@/components/shadcn/button'
import { useGetContractByIdQuery } from '@/features/contract/api/contractApi'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type ContractInfoProps = {
  contractId?: number
}

export default function ContractInfo({ contractId }: ContractInfoProps) {
  const locale = useLocale()
  const to = useTranslations('organization.detail')

  const { data, isLoading } = useGetContractByIdQuery(contractId!, { skip: !contractId })
  const contract = data?.data

  if (isLoading) {
    return (
      <Card className='p-4'>
        <CardHeader className='pb-2'>
          <Skeleton className='h-6 w-1/2' />
        </CardHeader>
        <CardContent className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </CardContent>
      </Card>
    )
  }

  if (!contract)
    return (
      <Card>
        <CardContent>
          <p className='text-muted-foreground text-center text-sm'>{to('contract.noContract')}</p>
        </CardContent>
      </Card>
    )

  return (
    <Card className='py-4'>
      {/* Header */}
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-base font-semibold'>{to('contract.header')}</CardTitle>
          {/* <Badge className={getStatusBadgeClass(contract.status)}>{translateStatus(contract.status)}</Badge> */}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className='space-y-3 text-sm'>
        {/* Contract name */}
        <div>
          <p className='mb-0.5 text-sm font-medium'>{to('contract.name')}</p>
          <p className='line-clamp-1'>{contract.name}</p>
        </div>

        {/* Description */}
        {contract.description && (
          <div>
            <p className='mb-0.5 text-sm font-medium'>{to('contract.description')}</p>
            <p className='line-clamp-2'>{contract.description}</p>
          </div>
        )}

        {/* View file (if available) */}
        {contract.fileUrl ? (
          <Button asChild variant='outline' size='sm' className='mt-2 w-full py-5'>
            <Link href={contract.fileUrl} target='_blank' className='flex items-center gap-1'>
              <FileText size={14} /> {to('contract.viewFile')}
            </Link>
          </Button>
        ) : (
          <div className='text-muted-foreground text-center text-xs italic'>{to('contract.noContractFile')}</div>
        )}
      </CardContent>
    </Card>
  )
}
