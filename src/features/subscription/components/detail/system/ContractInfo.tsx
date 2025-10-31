'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { useGetContractByIdQuery } from '@/features/contract/api/contractApi'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, FileText, Building2 } from 'lucide-react'
import { formatDateV2 } from '@/utils/index'

type ContractInfoProps = {
  contractId?: number
}

export default function ContractInfo({ contractId }: ContractInfoProps) {
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
          <p className='text-muted-foreground text-center text-sm'>No contract data available.</p>
        </CardContent>
      </Card>
    )

  return (
    <Card className='py-4'>
      {/* Header */}
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-base font-semibold'>Contract Information</CardTitle>
          <Badge className={getStatusBadgeClass(contract.status)}>{contract.status}</Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className='space-y-3 text-sm'>
        {/* Contract name */}
        <div>
          <p className='text-muted-foreground mb-1 text-xs'>Contract Name</p>
          <p className='line-clamp-1 font-medium'>{contract.name}</p>
        </div>

        {/* Description */}
        {contract.description && (
          <div>
            <p className='text-muted-foreground mb-1 text-xs'>Description</p>
            <p className='line-clamp-2'>{contract.description}</p>
          </div>
        )}

        {/* Created date */}
        <div className='flex justify-between'>
          <span className='text-muted-foreground flex items-center gap-1'>
            <Calendar size={14} />
            Created
          </span>
          <span>{formatDateV2(new Date(contract.createdAt))}</span>
        </div>

        {/* View file (if available) */}
        {contract.fileUrl ? (
          <Button asChild variant='outline' size='sm' className='mt-2 w-full p-6'>
            <Link href={contract.fileUrl} target='_blank' className='flex items-center gap-1'>
              <FileText size={14} /> View Contract File
            </Link>
          </Button>
        ) : (
          <div className='text-muted-foreground text-center text-xs italic'>No contract file uploaded</div>
        )}
      </CardContent>
    </Card>
  )
}
