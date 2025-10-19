'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'
import { useModal } from '@/providers/ModalProvider'
import { Contact } from '@/features/contact/types/contact.type'
import UpsertContactDetail from '@/features/contact/components/detail/UpsertContactDetail'

export default function ContactDetailSheet({ contact }: { contact: Contact }) {
  const { closeModal } = useModal()

  return (
    <Sheet open onOpenChange={(open) => !open && closeModal()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Contact Details - {contact.firstName} {contact.lastName}
          </SheetTitle>
        </SheetHeader>
        <UpsertContactDetail />
      </SheetContent>
    </Sheet>
  )
}
