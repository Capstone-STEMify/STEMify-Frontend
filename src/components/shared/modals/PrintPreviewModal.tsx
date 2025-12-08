import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Printer, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setIsPrintModalOpen } from '@/features/resource/lesson/slice/lessonDetailSlice'

// A child component to render footer just when printing
const PrintFooter = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const generationDate = new Date().toLocaleDateString()

  return (
    <div className='mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500'>
      <div className='flex justify-between'>
        <span>Copyright 2025 © STEMify </span>
        <span>Generated on {generationDate}</span>
        <span className='max-w-[200px] truncate'>{currentUrl}</span>
      </div>
    </div>
  )
}

type PrintPreviewModalProps = {
  title: string
  children: React.ReactNode
}

export default function PrintPreviewModal({ title, children }: PrintPreviewModalProps) {
  const { isPrintModalOpen } = useAppSelector((state) => state.lessonDetail)
  const dispatch = useAppDispatch()
  const contentRef = useRef<HTMLDivElement>(null)

  const tc = useTranslations('common.button')

  const handlePrint = useReactToPrint({
    contentRef
    // content: () => contentRef.current,
    // documentTitle: title,
    // pageStyle: `
    //   @media print {
    //     @page {
    //       size: auto;
    //       margin: 20mm;
    //     }
    //     body {
    //       -webkit-print-color-adjust: exact;
    //     }
    //     .print-footer {
    //       position: fixed;
    //       bottom: 0;
    //       left: 0;
    //       right: 0;
    //       padding: 0 20mm;
    //     }
    //     .content-body {
    //       padding-bottom: 50px;
    //     }
    //   }
    // `
  })

  return (
    <Dialog open={isPrintModalOpen} onOpenChange={() => dispatch(setIsPrintModalOpen(false))}>
      <DialogContent className='flex h-[90vh] max-w-4xl flex-col p-0'>
        <DialogHeader className='p-6 pb-2'>
          <DialogTitle className='text-xl font-bold'>{title}</DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-hidden px-6'>
          {/* Preview content area */}
          <ScrollArea className='h-full rounded-md border bg-gray-100 p-4'>
            <div ref={contentRef} className='bg-white p-8 shadow-sm'>
              <div className='content-body'>{children}</div>
              <div className='print-footer'>
                <PrintFooter />
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className='border-t bg-gray-50 p-6'>
          <Button variant='outline' onClick={() => dispatch(setIsPrintModalOpen(false))}>
            <X className='mr-2 h-4 w-4' /> {tc('cancel')}
          </Button>
          <Button onClick={handlePrint}>
            <Printer className='mr-2 h-4 w-4' /> {tc('print')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
