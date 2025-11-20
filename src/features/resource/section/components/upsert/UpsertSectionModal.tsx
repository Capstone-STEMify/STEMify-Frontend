'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '../../../../../providers/ModalProvider'
import UpsertSection from '@/features/resource/section/components/upsert/UpsertSection'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useTranslations } from 'next-intl'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
interface ConfirmModalProps {
  lessonId: number
  sectionId: number
  onConfirm: () => void
}
export default function UpsertSectionModal({ lessonId, sectionId, onConfirm }: ConfirmModalProps) {
  const t = useTranslations('section')
  const { closeModal } = useModal()
  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='flex w-full flex-col lg:w-[660px]'>
        <DialogHeader>
          <DialogTitle>
            <div>
              {sectionId ? (
                t('form.title.update')
              ) : (
                <div>
                  {t('form.title.create')}{' '}
                  <Button variant={'ghost'} onClick={() => {}}>
                    <Sparkles size={15} />
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <hr />
        <div>
          <UpsertSection lessonId={lessonId} sectionId={sectionId} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
