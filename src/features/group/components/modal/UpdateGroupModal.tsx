import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import UpdateGroup from '@/features/group/components/upsert/UpdateGroup'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

export default function UpdateGroupModal() {
  const { closeModal } = useModal()
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle>Update Group</DialogTitle>
        <UpdateGroup />
      </DialogContent>
    </Dialog>
  )
}
