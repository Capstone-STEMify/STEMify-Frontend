import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'

type SSheetProps = {
  isOpen: boolean
  setOpen: (open: boolean) => void
  trigger: React.ReactNode
  content: React.ReactNode
  title: string
}

export default function SSheet({ isOpen, setOpen, trigger, content, title }: SSheetProps) {
  return (
    <div className='mb-4 flex lg:hidden'>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side='left' className='w-[80vw] sm:w-[400px]'>
          <SheetHeader>
            <SheetTitle className='text-lg'>{title}</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    </div>
  )
}
