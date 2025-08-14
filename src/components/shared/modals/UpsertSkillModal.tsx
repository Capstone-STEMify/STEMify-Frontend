'use client'
import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import UpsertSkill from '@/features/resource/skill/components/management/UpsertSkill'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

interface UpsertSkillModalProps {
  id?: number
  onConfirm?: () => void
}

export default function UpsertSkillModal({ id, onConfirm }: UpsertSkillModalProps) {
  const { closeModal } = useModal()

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='sm:max-w-[425px] w-full'>
        <UpsertSkill id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
