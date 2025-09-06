'use client'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import ContentDetail from '@/features/resource/content/components/detail/ContentDetail'
import { useModal } from '@/providers/ModalProvider'

type ContentDetailModalProps = {
  contentId?: number
}

export default function ContentDetailModal({ contentId }: ContentDetailModalProps) {
  const { openModal, closeModal } = useModal()

  const handleEditContent = () => {
    openModal('upsertContent', { contentId })
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

        <ScrollArea className='h-[550px] w-7xl'>
          <ContentDetail contentId={contentId} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
