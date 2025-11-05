import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Camera } from 'lucide-react'

interface CameraTestProps {
  onOpenCamera: () => void
}

export function CameraTest({ onOpenCamera }: CameraTestProps) {
  return (
    <Card className='border-2 border-gray-200 bg-gray-50 py-4'>
      <CardHeader>
        <CardTitle className='text-xl'>Test với camera</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-5 transition-all hover:border-[#4facfe] hover:bg-blue-50/50'>
          <p className='mb-5 text-center text-xl text-gray-700'>Sử dụng camera để chụp ảnh test</p>
          <Button onClick={onOpenCamera} className='mb-2.5 bg-sky-100 px-8 py-6 text-blue-500 hover:bg-sky-200'>
            <Camera className='mr-2 h-5 w-5' />
            Mở Camera
          </Button>
          <p className='text-center text-sm text-gray-500'>
            Nhấn nút đỏ để chụp ảnh
            <br />
            Ảnh sẽ được phân tích tự động
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
