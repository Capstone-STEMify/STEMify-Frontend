'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'
import { useModal } from '@/providers/ModalProvider'
import { Contact } from '@/features/contact/types/contact.type'
import UpsertContact from '@/features/contact/components/upsert/UpsertContact'

export default function ContactDetailSheet({ contact }: { contact?: Contact }) {
  const { closeModal } = useModal()

  return (
    <Sheet open onOpenChange={(open) => !open && closeModal()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {contact ? `Contact Detail: ${contact.firstName} ${contact.lastName}` : 'Create Contact'}
          </SheetTitle>
        </SheetHeader>
        <UpsertContact id={contact?.id} onSuccess={closeModal} />
      </SheetContent>
    </Sheet>
  )
}
