import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import CreateQuiz from '@/features/resource/quiz/components/upsert/CreateQuiz'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

type CreateQuizModalProps = {
  sectionId: number
}

export default function CreateQuizModal({ sectionId }: CreateQuizModalProps) {
  const tq = useTranslations('quiz.upsert')
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>{tq('create')}</DialogTitle>
        <CreateQuiz sectionId={sectionId} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  )
}
