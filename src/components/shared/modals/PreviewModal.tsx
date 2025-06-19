'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '../../../providers/ModalProvider'

interface PreviewModalProps {
  data: Record<string, any>
  title?: string
}

export default function PreviewModal({ data, title }: PreviewModalProps) {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>{title || 'Preview Details'}</DialogTitle>
        </DialogHeader>
        <div className='text-muted-foreground space-y-2 text-sm'>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className='flex justify-between border-b py-1'>
              <span className='font-medium'>{key}</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
