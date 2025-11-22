'use client'

import { Badge } from '@/components/shadcn/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useStatusTranslation } from '@/utils/index'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

type StatusOption = {
  label: string
  value: string
}

type SStatusDropdownProps = {
  value: string
  options: StatusOption[]
  onChange: (value: string) => void
}

export default function SStatusDropdown({ value, options, onChange }: SStatusDropdownProps) {
  const translateStatus = useStatusTranslation()
  const current = options.find((o) => o.value === value)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center gap-1 outline-none'>
          <Badge className={`flex cursor-pointer items-center gap-1 select-none ${getStatusBadgeClass(value as any)} `}>
            {current ? translateStatus(current.label) : value}
            <ChevronDown className='h-3 w-3 opacity-70' />
          </Badge>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='min-w-[160px] rounded-md border bg-white p-1 shadow-md'>
        {options.map((opt) => {
          const isActive = opt.value === value

          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={(e) => {
                e.stopPropagation()
                if (opt.value === value) return
                onChange(opt.value)
              }}
              className={`my-1 flex cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-100 ${isActive ? 'bg-blue-50' : ''} `}
            >
              <Badge className={getStatusBadgeClass(opt.value)}>{translateStatus(opt.label)}</Badge>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
