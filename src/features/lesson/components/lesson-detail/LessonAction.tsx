import { Button } from '@/components/shadcn/button'
import { Bookmark, Plus, Share2 } from 'lucide-react'

export default function LessonAction() {
  return (
    <section className='border-muted-foreground mt-6 flex flex-col items-center border-t'>
      {/* CTA Button */}
      <div className='mt-6'>
        <Button size='lg' className='bg-yellow-400 font-semibold text-black shadow-md hover:bg-yellow-500'>
          ASSIGN TO CLASS
        </Button>
      </div>

      {/* Secondary actions */}
      <div className='text-muted-foreground mt-6 grid w-full max-w-md grid-cols-3 gap-6 text-center text-xs'>
        <div className='flex flex-col items-center gap-1'>
          <Plus className='h-5 w-5' />
          <span>Add to course</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Bookmark className='h-5 w-5' />
          <span>Add to favorites</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Share2 className='h-5 w-5' />
          <span>Share</span>
        </div>
      </div>
    </section>
  )
}
