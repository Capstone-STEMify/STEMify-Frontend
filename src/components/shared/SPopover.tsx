import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'

type SPopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function SPopover({ trigger, children, className, side, align }: SPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className={`w-fit ${className}`} side={side} align={align}>
        {children}
      </PopoverContent>
    </Popover>
  )
}
