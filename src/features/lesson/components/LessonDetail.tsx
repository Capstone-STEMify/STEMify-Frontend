import { Breadcrumb } from '@/components/shadcn/breadcrumb'

export default function LessonDetail() {
  return (
    <div className='container mx-auto'>
      <Breadcrumb />
      <div className='flex'>
        <div className='flex-1'>sidebar</div>
        <div>content</div>
      </div>
    </div>
  )
}
