import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import { useModal } from '../../../providers/ModalProvider'

export default function GenericFormModal({ defaultValues }: { defaultValues?: any }) {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <h2 className='text-lg font-semibold'>Form Modal</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log('Submit form data...')
            closeModal()
          }}
        >
          <input defaultValue={defaultValues?.title} />
          <button type='submit'>Save</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
