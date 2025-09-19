'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertContent from '@/features/resource/content/components/upsert/UpsertContent'
import { useModal } from '@/providers/ModalProvider'

type UpsertContentModalProps = {
  sectionId?: number
  contentId?: number
}

export default function UpsertContentModal({ sectionId, contentId }: UpsertContentModalProps) {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogTitle></DialogTitle>
      <DialogContent className='w-full max-w-6xl border-0 bg-transparent p-0 shadow-none [&>button]:right-8'>
        <div className='h-full w-full'>
          <UpsertContent sectionId={sectionId!} contentId={contentId!} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
