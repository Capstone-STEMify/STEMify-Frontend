import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Input } from '@/components/shadcn/input'
import { Skeleton } from '@/components/shadcn/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { useGetContractByIdQuery } from '@/features/contract/api/contractApi'
import { FileText, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'

type ContractInfoProps = {
  contractId?: number
}

export default function ContractInfo({ contractId }: ContractInfoProps) {
  const { data, isLoading } = useGetContractByIdQuery(contractId!, { skip: !contractId })

  if (isLoading) {
    return (
      <div>
        <Skeleton className='mb-2 h-6 w-1/3' />
        <Skeleton className='mb-1 h-4 w-full' />
        <Skeleton className='mb-1 h-4 w-full' />
        <Skeleton className='mb-1 h-4 w-1/2' />
      </div>
    )
  }
  return (
    <Card className='py-4'>
      <CardHeader>
        <CardTitle>Contract Information</CardTitle>
      </CardHeader>
      <CardContent>

        
      </CardContent>
    </Card>
  )
}
