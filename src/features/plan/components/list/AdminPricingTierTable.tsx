'use client'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import PricingTierUpsert from '@/features/plan/components/upsert/PricingTierUpsert'
import { BillingCycle, Plan, PlanPricingTier } from '@/features/plan/types/plan.type'
import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'

type AdminPricingTierTableProps = {
  plan: Plan & {
    pricingTiers: PlanPricingTier[]
  }
}

export default function AdminPricingTierTable({ plan }: AdminPricingTierTableProps) {
  const getBillingCycleLabel = (cycle: BillingCycle) => {
    return cycle === BillingCycle.SIXMONTHS ? '6 Months' : '12 Months'
  }
  return (
    <div className='p-6'>
      <PricingTierUpsert />
      <div className='bg-card overflow-hidden rounded-lg border shadow-sm'>
        <Table>
          <TableHeader className='border-b'>
            <TableRow className='bg-muted/70 hover:bg-muted/70'>
              <TableHead className='text-foreground font-semibold'>Billing Cycle</TableHead>
              <TableHead className='text-foreground font-semibold'>Seat Range</TableHead>
              <TableHead className='text-foreground font-semibold'>Min Seats</TableHead>
              <TableHead className='text-foreground font-semibold'>Max Seats</TableHead>
              <TableHead className='text-foreground text-right font-semibold'>Price</TableHead>
              <TableHead className='text-foreground text-right font-semibold'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              const groupedTiers: { cycle: BillingCycle; tiers: PlanPricingTier[] }[] = []

              plan.pricingTiers.forEach((tier) => {
                const existingGroup = groupedTiers.find((g) => g.cycle === tier.billingCycle)
                if (existingGroup) {
                  existingGroup.tiers.push(tier)
                } else {
                  groupedTiers.push({ cycle: tier.billingCycle, tiers: [tier] })
                }
              })

              return groupedTiers.flatMap((group, groupIndex) =>
                group.tiers.map((tier, index) => (
                  <TableRow
                    key={tier.id}
                    className={`hover:bg-muted/40 transition-colors ${
                      groupIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    {index === 0 && (
                      <TableCell rowSpan={group.tiers.length} className='bg-muted/30 border-r align-middle'>
                        <div className='flex items-center justify-center'>
                          <Badge
                            variant='secondary'
                            className='bg-primary/10 text-primary border-primary/20 px-3 py-1.5 text-sm font-semibold'
                          >
                            {getBillingCycleLabel(tier.billingCycle)}
                          </Badge>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className='text-muted-foreground text-sm font-medium'>
                      {tier.minSeat} - {tier.maxSeat} seats
                    </TableCell>
                    <TableCell className='text-sm font-medium'>{tier.minSeat}</TableCell>
                    <TableCell className='text-sm font-medium'>{tier.maxSeat}</TableCell>
                    <TableCell className='text-right'>
                      <span className='text-foreground text-2xl font-bold tracking-tight'>${tier.pricePerSeat}</span>
                      <span className='text-muted-foreground ml-1 text-xs'></span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='hover:bg-primary/10 hover:text-primary h-8 w-8 p-0'
                          onClick={() => console.log('[v0] Edit tier:', tier.id)}
                        >
                          <Pencil className='h-3.5 w-3.5' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0'
                          onClick={() => console.log('[v0] Delete tier:', tier.id)}
                        >
                          <Trash2 className='h-3.5 w-3.5' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )
            })()}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
