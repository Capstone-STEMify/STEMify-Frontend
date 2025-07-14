import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'

type SPopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
}

export function SPopover({ trigger, children }: SPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className='w-fit px-10'>{children}</PopoverContent>
    </Popover>
  )
}
