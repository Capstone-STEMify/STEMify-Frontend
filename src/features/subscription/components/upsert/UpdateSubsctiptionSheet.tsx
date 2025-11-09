'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'
import { useModal } from '@/providers/ModalProvider'
import UpsertSystemSubsctiption from '@/features/subscription/components/upsert/UpdateSubscription'

export default function UpdateSubsctiptionSheet({ subscriptionId }: { subscriptionId: number }) {
  const { closeModal } = useModal()
  console.log('subscriptionId', subscriptionId)

  return (
    <Sheet open onOpenChange={(open) => !open && closeModal()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle> Edit Subscription </SheetTitle>
        </SheetHeader>
        <UpsertSystemSubsctiption subscriptionId={subscriptionId} />
      </SheetContent>
    </Sheet>
  )
}
