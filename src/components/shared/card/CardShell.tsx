import clsx from 'clsx'

type CardShellProps = {
  image: string
  tags?: React.ReactNode
  children: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: {
    container: 'max-w-xs', // Chiều rộng
    image: 'h-40', // Chiều cao ảnh
    padding: 'p-4',
    text: 'text-sm'
  },
  md: {
    container: 'max-w-sm',
    image: 'h-64',
    padding: 'p-6',
    text: 'text-base'
  },
  lg: {
    container: 'max-w-md',
    image: 'h-80',
    padding: 'p-8',
    text: 'text-base'
  }
} satisfies Record<string, { container: string; image: string; padding: string; text: string }>

export const CardShell = ({ image, tags, children, rightIcon, size = 'md', className }: CardShellProps) => {
  const { container, image: imageHeight, padding, text } = sizeStyles[size]

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl',
        container,
        className
      )}
    >
      <div className='absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-60 group-hover:animate-ping'></div>

      <div className={clsx('relative overflow-hidden', imageHeight)}>
        <img
          src={image}
          alt='error loading image'
          className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
        />
        {tags && <div className='absolute bottom-4 left-4 flex gap-2'>{tags}</div>}
      </div>

      <div className={clsx(padding, text)}>
        {children}

        {rightIcon && (
          <div className='mt-4 flex justify-end'>
            <div className='rounded-full bg-gray-400 p-2 transition-colors duration-300 group-hover:bg-gray-300'>
              {rightIcon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
