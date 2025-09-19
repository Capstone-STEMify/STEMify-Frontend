import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import PacingGuide from '../pacing-guide/PacingGuide'

export default function PacingGuideModal() {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='flex w-full flex-col lg:max-w-7xl'>
        <DialogHeader className='shrink-0'>
          <DialogTitle>PACING GUIDE</DialogTitle>
        </DialogHeader>
        <hr />
        <ScrollArea className='h-[650px] max-w-7xl'>
          <PacingGuide isModal={true} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
