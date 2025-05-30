import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'

export function InputFile() {
  return (
    <div className='grid w-full max-w-sm items-center gap-3'>
      <Label htmlFor='picture'>Picture</Label>
      <Input id='picture' type='file' />
    </div>
  )
}
