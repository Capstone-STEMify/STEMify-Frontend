import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/shadcn/dialog'
import { useCreateSectionMutation } from '@/features/resource/section/api/sectionApi'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'
import { toast } from 'sonner'

type SectionAIModalProps = {
  lessonId: number
  title: string
  durationMinutes: number
  description: string
}

export default function SectionAIModal({ lessonId, title, durationMinutes, description }: SectionAIModalProps) {
  const ta = useTranslations('agent')
  const tt = useTranslations('toast')

  const { closeModal } = useModal()
  const [createSection] = useCreateSectionMutation()
  const handleAccept = async () => {
    await createSection({
      lessonId,
      title,
      description,
      duration: durationMinutes,
      isVisibleToStudent: true
    })
    toast.success(tt('successMessage.create', { title }))
    closeModal()
  }
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{ta('section.title')}</DialogTitle>
        <h2>{title}</h2>
        <p>
          {ta('section.duration')}: {durationMinutes} {ta('section.minutes')}
        </p>
        <p>{description}</p>

        <DialogFooter>
          <Button onClick={handleAccept}>{ta('section.accept')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
