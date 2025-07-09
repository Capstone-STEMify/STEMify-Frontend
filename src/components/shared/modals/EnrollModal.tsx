import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useCreateEnrollmentMutaion } from '@/features/enrollment/api/enrollmentApi'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function EnrollModal() {
  const { closeModal } = useModal()
  const [createEnroll] = useCreateEnrollmentMutaion()

  const handleEnroll = async () => {
    try {
      // const res = await createEnroll({
      //   studentId: 'f21b8c67-3d49-4c4f-84e7-2b76f017ecb2',
      //   classroomId: '3'
      // }).unwrap()
      // console.log('Enrollment successful:', res)
      toast.success('Successfully enrolled in the classroom!')
    } catch (error) {
      console.error('Enrollment failed:', error)
      toast.error('Failed to enroll in the classroom.')
    }
  }
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className='space-y-6 px-8'>
          <div>
            <DialogTitle className='text-lg font-semibold'>Enroll in a Classroom</DialogTitle>
            <p className='text-muted-foreground text-sm'>
              You can enroll in a classroom by providing the classroom ID or by searching for it.
            </p>
          </div>
          <div className=''>
            <p className='text-sm font-medium'>Enroll by Classroom ID</p>
            {/* Add input for Classroom ID enrollment */}
            <input
              type='text'
              placeholder='Enter Classroom ID'
              className='mt-2 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
          <div className=''>
            <p className='text-sm font-medium'>Search for a Classroom</p>
            {/* Add search functionality here */}
            <input
              type='text'
              placeholder='Search for a Classroom'
              className='mt-2 w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>
          <Button variant='outline' className='flex items-center gap-2' onClick={handleEnroll}>
            <Plus className='h-4 w-4' />
            Enroll in a classroom
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
