type SListTitleProps = {
  title?: string
  description?: string
}

export default function SListTitle({ title, description }: SListTitleProps) {
  return (
    <div className='h-45 space-y-5 px-10 py-5'>
      <h1 className='text-4xl'>{title}</h1>
      <p className='max-w-md text-gray-700'>{description}</p>
    </div>
  )
}
