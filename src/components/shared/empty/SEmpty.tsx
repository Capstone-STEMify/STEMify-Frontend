import { Search } from 'lucide-react'

type SEmptyProps = {
  title: string
  description: string
  icon?: React.ReactNode
}

export default function SEmpty({
  title,
  description,
  icon = <Search className='h-10 w-10 text-gray-400' />
}: SEmptyProps) {
  return (
    <div className='py-16 text-center'>
      <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100'>
        {icon}
      </div>
      <h3 className='mb-2 text-xl font-semibold text-gray-700'>{title}</h3>
      <p className='text-gray-500'>{description}</p>
    </div>
  )
}
