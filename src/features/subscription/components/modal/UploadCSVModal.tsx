import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import UploadCSV from '@/features/subscription/components/modal/UploadCSV'

export default function UploadCSVModal() {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-xl'>
        <DialogTitle>Upload CSV</DialogTitle>
        <UploadCSV />
      </DialogContent>
    </Dialog>
  )
}
