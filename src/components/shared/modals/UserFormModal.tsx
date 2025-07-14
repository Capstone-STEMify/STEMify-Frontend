import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '../../../providers/ModalProvider'
import UserForm from '@/components/shared/form/UserForm'

export default function UserFormModal({ defaultValues }: { defaultValues?: any }) {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogTitle className='text-lg font-semibold'>User Form</DialogTitle>
        <UserForm />
      </DialogContent>
    </Dialog>
  )
}
