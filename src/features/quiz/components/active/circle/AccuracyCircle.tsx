import { cn } from '@/shadcn/utils'

interface ProgressCircleProps {
  value: number | null
  size?: number
  strokeWidth?: number
  className?: string
  showPercentageText?: boolean
}

export function ProgressCircle({
  value,
  size = 36,
  strokeWidth = 3,
  className,
  showPercentageText = true
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = value !== null ? circumference - (value / 100) * circumference : 0

  // Handle the indeterminate/null state
  if (value === null) {
    return (
      <div className='relative flex items-center justify-center' style={{ width: size, height: size }}>
        <svg className='h-full w-full' viewBox={`0 0 ${size} ${size}`}>
          <circle
            className='text-gray-200'
            strokeWidth={strokeWidth}
            stroke='currentColor'
            fill='transparent'
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <span className='absolute text-gray-400'>-</span>
      </div>
    )
  }

  return (
    <div className='relative flex items-center justify-center' style={{ width: size, height: size }}>
      <svg className='h-full w-full -rotate-90' viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <circle
          className='text-gray-200'
          strokeWidth={strokeWidth}
          stroke='currentColor'
          fill='transparent'
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Foreground Circle */}
        <circle
          className={cn('transition-all duration-300', className)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          stroke='currentColor'
          fill='transparent'
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showPercentageText && <span className='absolute text-xs font-semibold text-gray-700'>{value}%</span>}
    </div>
  )
}
