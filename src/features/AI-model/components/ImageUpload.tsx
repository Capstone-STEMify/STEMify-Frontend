import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Camera } from 'lucide-react'

interface ImageUploadProps {
  classes: string[]
  classImages: Record<string, string[]>
  onOpenCamera: (className: string) => void
  onRemoveImage: (className: string, index: number) => void
}

export function ImageUpload({ classes, classImages, onOpenCamera, onRemoveImage }: ImageUploadProps) {
  return (
    <Card className='py-4'>
      <CardHeader>
        <CardTitle className='text-2xl'>3. Upload ảnh vào từng class</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-5'>
          {classes.map((className) => (
            <Card key={className} className='py-4'>
              <CardHeader>
                <CardTitle className='text-center text-lg'>{className}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='mb-4 flex min-h-[150px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-5 transition-all hover:border-[#4facfe] hover:bg-blue-50/50'>
                  <p className='mb-4 text-center text-gray-600'>Sử dụng camera để chụp ảnh cho class này</p>
                  <Button
                    onClick={() => onOpenCamera(className)}
                    className='bg-[#2ed573] px-8 py-6 text-lg hover:bg-[#26d065]'
                  >
                    <Camera className='mr-2 h-5 w-5' />
                    Mở Camera
                  </Button>
                  <p className='mt-2.5 text-center text-sm text-gray-500'>
                    Nhấn và giữ nút chụp để chụp liên tục
                    <br />
                    Nhấn một lần để chụp một ảnh
                  </p>
                </div>

                {/* Image preview grid */}
                <div className='mb-4 grid grid-cols-4 gap-2.5 md:grid-cols-6'>
                  {classImages[className]?.map((imageSrc, index) => (
                    <img
                      key={index}
                      src={imageSrc}
                      alt={`${className} ${index + 1}`}
                      className='h-24 w-full cursor-pointer rounded-lg border-2 border-gray-300 object-cover transition-opacity hover:opacity-75'
                      onClick={() => onRemoveImage(className, index)}
                    />
                  ))}
                </div>

                <p className='text-gray-600'>
                  Đã upload: <span className='font-semibold'>{classImages[className]?.length || 0}</span> ảnh
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
