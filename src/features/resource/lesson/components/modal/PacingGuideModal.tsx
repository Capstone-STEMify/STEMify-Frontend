import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import PacingGuide from '../pacing-guide/PacingGuide'

export default function PacingGuideModal() {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='flex w-full max-w-[660px] flex-col lg:w-[660px]'>
        <DialogHeader className='shrink-0'>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <hr />
        <ScrollArea className='h-[500px]'>
          <PacingGuide />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
