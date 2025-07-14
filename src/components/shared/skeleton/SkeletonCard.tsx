import { Skeleton } from '@/components/shadcn/skeleton'
import clsx from 'clsx'

export function SkeletonCard({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses: Record<string, { width: string; height: string; imageHeight: string }> = {
    sm: { width: 'w-[200px]', height: 'h-[280px]', imageHeight: 'h-[140px]' },
    md: { width: 'w-[264px]', height: 'h-[350px]', imageHeight: 'h-[180px]' },
    lg: { width: 'w-[320px]', height: 'h-[400px]', imageHeight: 'h-[200px]' },
    xl: { width: 'w-[400px]', height: 'h-[500px]', imageHeight: 'h-[260px]' }
  }

  const { width, height, imageHeight } = sizeClasses[size]

  return (
    <div className={clsx('shadow-6 flex animate-pulse flex-col overflow-hidden rounded-xl bg-white', width, height)}>
      <div className={clsx('w-full', imageHeight)}>
        <Skeleton className='h-full w-full object-cover' />
      </div>
      <div className='flex-1 space-y-2 p-3'>
        <Skeleton className='h-5 w-3/4 rounded-md' />
        <Skeleton className='h-4 w-1/2 rounded-md' />
      </div>
    </div>
  )
}
