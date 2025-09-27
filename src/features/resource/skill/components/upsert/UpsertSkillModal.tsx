'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpsertSkill from '@/features/resource/skill/components/upsert/UpsertSkill'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertSkillModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertSkillModal({ id, onConfirm }: UpsertSkillModalProps) {
  const { closeModal } = useModal()
  const t = useTranslations('Admin.skill')

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogTitle></DialogTitle>

      <DialogContent className='w-[95%] rounded-xl p-4 sm:max-w-md sm:p-6 md:max-w-lg lg:max-w-xl'>
        <DialogTitle>
          <p>{id ? `${t('editTitle')}` : `${t('createTitle')}`}</p>
        </DialogTitle>
        <hr />
        <UpsertSkill id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
