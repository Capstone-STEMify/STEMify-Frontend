'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'
import { useModal } from '@/providers/ModalProvider'
import UpsertPlan from '@/features/plan/components/upsert/UpsertPlan'

export default function UpsertSystemSubsctiptionSheet({ planId }: { planId: number }) {
  const { closeModal } = useModal()

  return (
    <Sheet open onOpenChange={(open) => !open && closeModal()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{planId ? 'Edit Plan' : 'Create New Plan'}</SheetTitle>
        </SheetHeader>
        <UpsertPlan planId={planId} />
      </SheetContent>
    </Sheet>
  )
}
