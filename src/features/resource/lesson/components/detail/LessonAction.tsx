import { Button } from '@/components/shadcn/button'
import { Bookmark, Plus, Share2 } from 'lucide-react'

export default function LessonAction() {
  return (
    <section className='mt-3 mb-5 flex flex-col items-center'>
      <div className='h-[0.1px] w-52 bg-gray-300'></div>

      {/* CTA Button */}
      <div className='mt-4'>
        <Button size='default' className='bg-yellow-400 font-semibold text-black shadow-md hover:bg-yellow-500'>
          <div className='text-xs'>ASSIGN TO CLASS</div>
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
