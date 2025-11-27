'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '../../../../../providers/ModalProvider'
import UpsertSection from '@/features/resource/section/components/upsert/UpsertSection'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useTranslations } from 'next-intl'
import { Loader, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useGenerateSectionMutation } from '@/features/chat/api/agentApi'
interface ConfirmModalProps {
  lessonId: number
  sectionId: number
  onConfirm: () => void
}
export default function UpsertSectionModal({ lessonId, sectionId, onConfirm }: ConfirmModalProps) {
  const t = useTranslations('section')
  const ta = useTranslations('agent')
  const { closeModal, openModal } = useModal()

  const [generateSection, { isLoading }] = useGenerateSectionMutation()

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  const handleGenerateSection = async () => {
    const res = await generateSection({ lesson_id: String(lessonId), force_mock: false })
    openModal('sectionAI', {
      lessonId,
      title: res.data?.section.title,
      durationMinutes: res.data?.section.durationMinutes,
      description: res.data?.section.description
    })
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
                <div className='flex gap-5'>
                  {t('form.title.create')}{' '}
                  <button
                    onClick={handleGenerateSection}
                    disabled={isLoading}
                    className='flex items-center gap-2 hover:cursor-pointer disabled:opacity-50'
                  >
                    {isLoading ? (
                      <Loader2 size={18} className='animate-spin text-blue-400' />
                    ) : (
                      <Sparkles size={18} className='text-blue-400' />
                    )}
                    {isLoading && <span className='text-sm text-blue-500'>{ta('section.generating')}</span>}
                  </button>
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
