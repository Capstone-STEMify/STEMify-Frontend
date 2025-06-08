import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/shadcn/drawer'

type SDrawerProps = {
  open: boolean
  setOpen: (open: boolean) => void
  trigger: React.ReactNode
  title: string
  description: string
  content: React.ReactNode
  close?: React.ReactNode
}
export default function SDrawer({ open, setOpen, content, description, title, trigger, close }: SDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='text-left'>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {content}
        {close && (
          <DrawerFooter className='pt-2'>
            <DrawerClose asChild>{close}</DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
