import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'

export default function UpsertGroupModal() {
  const { closeModal } = useModal()
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Create / Update Group</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
