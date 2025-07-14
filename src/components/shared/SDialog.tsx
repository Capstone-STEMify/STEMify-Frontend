import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/shadcn/dialog'
import { ReactNode } from 'react'

type SDialogProps = {
  open?: boolean
  setOpen?: (open: boolean) => void
  title: string
  trigger: ReactNode
  content: ReactNode
  description?: string
  footer?: ReactNode
}

export function SDialog({ open, setOpen, trigger, title, description, content, footer }: SDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='w-auto max-w-fit p-6'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
        {footer && (
          <DialogFooter>
            <DialogClose asChild>{footer}</DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
