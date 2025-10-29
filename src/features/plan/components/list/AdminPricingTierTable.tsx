'use client'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Plan, BillingCycle } from '@/features/plan/types/plan.type'
import React from 'react'
import SAvatar from '@/components/shared/SAvatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn/hover-card'
import Image from 'next/image'

type AdminPricingTierTableProps = {
  plan: Plan
}

export default function AdminPricingTierTable({ plan }: AdminPricingTierTableProps) {
  const getBillingCycleLabel = (cycle: BillingCycle) => {
    switch (cycle) {
      case BillingCycle.SEMIANNUAL:
        return '6 Months'
      case BillingCycle.ANNUAL:
        return '12 Months'
      default:
        return cycle
    }
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-foreground text-2xl font-bold tracking-tight'>{plan.name}</h2>

        <div className='flex items-center gap-2'>
          <span>Organization:</span>
          <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2'>
            <SAvatar src='https://github.com/shadcn.png' fallback='CN' />
            <SAvatar src='https://github.com/shadcn.png' fallback='CN' />
            <SAvatar src='https://github.com/shadcn.png' fallback='CN' />
          </div>
        </div>
      </div>

      <div className='bg-card overflow-hidden rounded-lg border shadow-sm'>
        <Table>
          <TableHeader className='bg-muted/70 border-b'>
            <TableRow>
              <TableHead className='text-foreground font-semibold'>Billing Cycle</TableHead>
              <TableHead className='text-foreground font-semibold'>Price</TableHead>
              <TableHead className='text-foreground font-semibold'>Is Add-on</TableHead>
              <TableHead className='text-foreground font-semibold'>Teacher Seats</TableHead>
              <TableHead className='text-foreground font-semibold'>Student Seats</TableHead>
              <TableHead className='text-foreground font-semibold'>Curriculums</TableHead>
              <TableHead className='text-foreground font-semibold'>Created Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {plan.planBillingCycles.map((cycle, index) => (
              <TableRow
                key={cycle.id}
                className={`hover:bg-muted/40 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
              >
                {/* Billing Cycle */}
                <TableCell className='align-middle'>
                  <Badge
                    variant='secondary'
                    className='bg-primary/10 text-primary border-primary/20 px-3 py-1.5 text-sm font-semibold'
                  >
                    {getBillingCycleLabel(cycle.billingCycle)}
                  </Badge>
                </TableCell>

                {/* Price */}
                <TableCell className='text-foreground text-lg font-bold'>
                  {cycle.price.toLocaleString('vi-VN')} ₫
                </TableCell>

                {/* Add-on */}
                <TableCell className='text-muted-foreground text-sm font-medium'>
                  {cycle.isAddOn ? 'Yes' : 'No'}
                </TableCell>

                {/* Seats */}
                <TableCell className='text-sm font-medium'>{plan.maxTeacherSeats}</TableCell>
                <TableCell className='text-sm font-medium'>{plan.maxStudentSeats}</TableCell>

                {/* Curriculums */}
                <TableCell className='text-muted-foreground text-sm'>
                  {plan.curriculums.length > 0 ? (
                    <ul className='list-disc pl-4'>
                      {plan.curriculums.map((c, index) => (
                        <li key={index}>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant='link'>{c.title}</Button>
                            </HoverCardTrigger>
                            <HoverCardContent className='w-80'>
                              <div className='flex flex-col'>
                                <Image src={c.imageUrl || ''} alt={c.title || ''} width={100} height={100} />
                                <h4 className='text-sm font-semibold'>{c.title}</h4>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className='text-muted-foreground italic'>No curriculums</span>
                  )}
                </TableCell>

                {/* Created Date */}
                <TableCell className='text-muted-foreground text-sm'>
                  {new Date(plan.createdAt ?? '').toLocaleDateString('vi-VN')}
                </TableCell>
              </TableRow>
            ))}

            {plan.planBillingCycles.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className='text-muted-foreground py-6 text-center text-sm italic'>
                  No billing cycles available for this plan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Extra Plan Info Section */}
      <div className='mt-6 space-y-2'>
        <h3 className='text-foreground text-lg font-semibold'>Plan Details</h3>
        <p className='text-muted-foreground text-sm'>
          <strong>Description:</strong> {plan.description}
        </p>
        <p className='text-muted-foreground text-sm whitespace-pre-line'>
          <strong>Access Support Detail:</strong> {plan.accessSupportDetail}
        </p>
      </div>
    </div>
  )
}
