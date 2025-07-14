import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'

type DropdownMenuProps = {
  trigger?: React.ReactNode
  label?: string
  items: React.ReactNode[]
  align?: 'start' | 'end'
  className?: string
}

export function SDropDown({ trigger, label, items, align = 'start', className }: DropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className={className} align={align}>
        {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}

        <DropdownMenuGroup>
          {items.map((item, index) => (
            <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
