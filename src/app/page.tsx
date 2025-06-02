import { Label } from '@/components/shadcn/label'
import { Separator } from '@/components/shadcn/separator'
import { Switch } from '@/components/shadcn/switch'
import { SkeletonAvatar } from '@/components/shared/skeleton/SkeletonAvatar'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import HomePage from '@/features/home/components/HomePage'

export default function Home() {
  return (
    <>
      {/* <Separator className='my-4' />
      <div className='flex items-center space-x-2'>
        <Switch id='airplane-mode' />
        <Label htmlFor='airplane-mode'>Airplane Mode</Label>
      </div>
      <SkeletonCard />
      <SkeletonAvatar /> */}
      <HomePage />
    </>
  )
}
