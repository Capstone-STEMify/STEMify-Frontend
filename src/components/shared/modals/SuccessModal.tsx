'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { CheckCircle2 } from 'lucide-react'
import { useModal } from '@/providers/ModalProvider'

type SuccessModalProps = {
  onClose: () => void
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const { closeModal } = useModal()
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='max-w-md rounded-2xl border-0 bg-white px-16 py-8 shadow-2xl'>
        <DialogHeader className='flex flex-col items-center space-y-4 text-center'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'>
            <CheckCircle2 className='h-10 w-10' />
          </div>

          <DialogTitle className='text-2xl font-bold text-slate-900'>🎉 Subscription Created Successfully!</DialogTitle>
          <p className='max-w-sm text-sm text-slate-600'>
            Your organization subscription has been created successfully. You can now manage it in the admin dashboard.
          </p>
        </DialogHeader>

        <div className='mt-6 flex justify-center gap-4'>
          <Button onClick={onClose} className='bg-gradient-to-r from-sky-500 to-blue-600 px-6 text-white'>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
