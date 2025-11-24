'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'
import { useModal } from '@/providers/ModalProvider'
import UpsertPlan from '@/features/plan/components/upsert/UpsertPlan'
import { useTranslations } from 'next-intl'

export default function UpsertPlanSheet({ planId }: { planId: number }) {
  const { closeModal } = useModal()
  const tp = useTranslations('plan')

  return (
    <Sheet open onOpenChange={(open) => !open && closeModal()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{planId ? tp('update') : tp('create')}</SheetTitle>
        </SheetHeader>
        <UpsertPlan planId={planId} />
      </SheetContent>
    </Sheet>
  )
}
