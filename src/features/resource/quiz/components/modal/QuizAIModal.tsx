import { Card } from '@/components/shadcn/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'

export default function QuizAIModal() {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-3xl'>
        <DialogTitle>Create Quiz with AI</DialogTitle>
        <Card>
          <div>
            <div></div>
            <div></div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
