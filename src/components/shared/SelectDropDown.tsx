import { Input } from '@/components/shadcn/input'
import { ChevronDown } from 'lucide-react'

type SelectDropdownProps = {
  value: string
  setValue: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  options: {
    value: number
    label: string
  }[]
  placeholder: string
}

export const SelectDropdown = ({ value, setValue, open, setOpen, options, placeholder }: SelectDropdownProps) => {
  return (
    <div className='relative w-full'>
      <Input
        type='text'
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className='cursor-pointer border-gray-300 bg-white pr-10 transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        onClick={() => setOpen(!open)}
        readOnly
      />
      <ChevronDown
        className={`pointer-events-none absolute top-3 right-3 h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      />

      {open && (
        <div className='absolute z-10 mt-1 max-h-50 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg'>
          {options.map((option) => (
            <div
              key={option.value}
              className='cursor-pointer px-4 py-2 text-sm transition-colors duration-150 last:border-b-0 hover:bg-blue-50'
              onClick={() => {
                setValue(option.label)
                setOpen(false)
              }}
            >
              {option.label} ages
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
