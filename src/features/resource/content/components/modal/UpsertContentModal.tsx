'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import UpsertContent from '@/features/resource/content/components/UpsertContent'
import { useModal } from '@/providers/ModalProvider'

type UpsertContentModalProps = {
  sectionId?: number
}

export default function UpsertContentModal({ sectionId }: UpsertContentModalProps) {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogTitle></DialogTitle>
      <DialogContent className='border-0 bg-transparent p-0 shadow-none'>
        <div className='w-7xl'>
          <UpsertContent sectionId={sectionId!} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
