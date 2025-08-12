import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'

type SPopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SPopover({ trigger, children, className }: SPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={`w-fit px-10 ${className}`}>{children}</PopoverContent>
    </Popover>
  )
}
