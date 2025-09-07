'use client'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import ContentDetail from '@/features/resource/content/components/detail/ContentDetail'
import { useModal } from '@/providers/ModalProvider'

type ContentDetailModalProps = {
  sectionId: number
}

export default function ContentDetailModal({ sectionId }: ContentDetailModalProps) {
  const { openModal, closeModal } = useModal()

  const handleEditContent = () => {
    openModal('upsertContent', { sectionId })
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className=''>
        <DialogTitle className='flex items-center justify-between'>
          <div>Content Detail</div>
          <div className='mr-5'>
            <Button variant={'outline'} className='hover:bg-gray-200' onClick={handleEditContent}>
              Edit
            </Button>
          </div>
        </DialogTitle>
        <hr />

        <ScrollArea className='h-[60vh] w-[70vw] max-w-6xl'>
          <ContentDetail sectionId={sectionId} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
