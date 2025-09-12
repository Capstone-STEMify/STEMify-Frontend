'use client'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import ContentDetail from '@/features/resource/content/components/detail/ContentDetail'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'

type ContentDetailModalProps = {
  sectionId: number
  contentId?: number
}

export default function ContentDetailModal({ sectionId, contentId }: ContentDetailModalProps) {
  const t = useTranslations('content')
  const tc = useTranslations('common')
  const { openModal, closeModal } = useModal()

  const handleEditContent = () => {
    openModal('upsertContent', { contentId, sectionId })
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className=''>
        <DialogTitle className='flex items-center justify-between'>
          <div>{t('detail.title')}</div>
          <div className='mr-5'>
            <Button variant={'outline'} className='hover:bg-gray-200' onClick={handleEditContent}>
              {tc('button.update')}
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
