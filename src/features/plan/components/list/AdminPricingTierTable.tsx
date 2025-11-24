'use client'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { Plan, BillingCycle } from '@/features/plan/types/plan.type'
import React from 'react'
import SAvatar from '@/components/shared/SAvatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn/hover-card'
import Image from 'next/image'
import { BookOpen, FileText, GraduationCap, Headphones, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

type AdminPricingTierTableProps = {
  plan: Plan
}

export default function AdminPricingTierTable({ plan }: AdminPricingTierTableProps) {
  const tp = useTranslations('plan')
  const tc = useTranslations('common')
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
      </div>

      <div className='bg-card overflow-hidden rounded-lg border shadow-sm'>
        <Table>
          <TableHeader className='bg-muted/70 border-b'>
            <TableRow>
              <TableHead className='text-foreground font-semibold'>{tc('tableHeader.planBillingCycle')}</TableHead>
              <TableHead className='text-foreground font-semibold'>{tc('tableHeader.price')}</TableHead>
              <TableHead className='text-foreground font-semibold'>{tc('tableHeader.teacherSeats')}</TableHead>
              <TableHead className='text-foreground font-semibold'>{tc('tableHeader.studentSeats')}</TableHead>
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
                  <Badge className='border-primary/20 text-primary bg-sky-100 px-3 py-1.5 text-sm font-semibold'>
                    {getBillingCycleLabel(cycle.billingCycle)}
                  </Badge>
                </TableCell>

                {/* Price */}
                <TableCell className='text-foreground text-lg font-bold'>
                  {cycle.price.toLocaleString('vi-VN')} ₫
                </TableCell>

                {/* Seats */}
                <TableCell>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <Users className='h-4 w-4 text-blue-500' />
                    {plan.maxTeacherSeats}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <GraduationCap className='h-4 w-4 text-green-500' />
                    {plan.maxStudentSeats}
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {plan.planBillingCycles.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className='text-muted-foreground py-6 text-center text-sm italic'>
                  {tp('detail.noBillingCycles')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Extra Plan Info Section */}
      <div className='mt-6 space-y-4'>
        <h3 className='text-foreground text-lg font-semibold'>{tp('detail.title')}</h3>
        <div className='text-muted-background text-sm break-words whitespace-pre-line'>
          <strong className='mb-2 flex items-center gap-2'>
            <FileText className='text-primary h-4 w-4' />
            {tp('detail.description')}:
          </strong>{' '}
          {plan.description}
        </div>
        <div className='text-muted-background text-sm break-words whitespace-pre-line'>
          <strong className='mb-2 flex items-center gap-2'>
            <Headphones className='text-primary h-4 w-4' />
            {tp('detail.accessSupportDetail')}:
          </strong>{' '}
          {plan.accessSupportDetail}
        </div>
        <div className='text-muted-background text-sm whitespace-pre-line'>
          <strong className='mb-2 flex items-center gap-2'>
            <BookOpen className='text-primary h-4 w-4' />
            {tp('detail.includedCurriculums')}:
          </strong>{' '}
          {plan.curriculums.length > 0 ? (
            <ul className='space-y-2'>
              {plan.curriculums.map((c, index) => (
                <li key={index}>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant='link' className='h-auto p-0 text-left font-normal hover:underline'>
                        <span className='flex items-center gap-2'>
                          <span className='text-primary flex h-6 w-6 items-center justify-center rounded-full bg-sky-200 text-xs font-medium'>
                            {index + 1}
                          </span>
                          <span>{c.title}</span>
                        </span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className='w-80'>
                      <div className='flex gap-4'>
                        <div className='flex-shrink-0'>
                          {c.imageUrl ? (
                            <Image
                              src={c.imageUrl}
                              alt={c.title || ''}
                              width={80}
                              height={80}
                              className='rounded-lg object-cover'
                            />
                          ) : (
                            <div className='flex h-[80px] w-[80px] items-center justify-center rounded-lg bg-gradient-to-br from-sky-200 to-blue-500'>
                              <GraduationCap className='h-8 w-8 text-white' />
                            </div>
                          )}
                        </div>
                        <div className='flex flex-col gap-1'>
                          <h4 className='leading-tight font-semibold'>{c.title}</h4>
                          {c.description && (
                            <p className='text-muted-foreground line-clamp-3 text-sm'>{c.description}</p>
                          )}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </li>
              ))}
            </ul>
          ) : (
            <div className='flex items-center gap-2 rounded-md border border-dashed p-4'>
              <GraduationCap className='text-muted-foreground h-5 w-5' />
              <span className='text-muted-foreground text-sm'>No curriculums available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
