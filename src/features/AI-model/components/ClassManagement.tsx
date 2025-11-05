import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useState } from 'react'
import { Camera, Edit, Edit2, Trash2, Webcam } from 'lucide-react'

interface ClassManagementProps {
  classes: string[]
  onAddNewClass: (className: string) => void

  classImages: Record<string, string[]>
  onOpenCamera: (className: string) => void
  onRemoveImage: (className: string, index: number) => void
}

export function ClassManagement({
  classes,
  onAddNewClass,
  classImages,
  onOpenCamera,
  onRemoveImage
}: ClassManagementProps) {
  const [newClassName, setNewClassName] = useState('')

  const handleAddClass = () => {
    if (newClassName.trim()) {
      onAddNewClass(newClassName.trim())
      setNewClassName('')
    }
  }

  return (
    <Card className='border-2 border-gray-200 bg-gray-50 py-4'>
      <CardHeader>
        <CardTitle className='text-2xl'>1. Tạo các class</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-5 grid grid-cols-1 gap-5 md:grid-cols-2'>
          {classes.map((className, index) => (
            <Card key={index} className='border-2 border-gray-200 py-4'>
              <CardHeader>
                <CardTitle className='flex items-center text-lg'>
                  {className}{' '}
                  <Button variant='ghost' className='cursor-pointer'>
                    <Edit2 size={15} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex cursor-pointer gap-2.5'>
                  <div
                    className='flex flex-col items-center gap-1 rounded-md bg-blue-50 p-3 text-blue-600'
                    onClick={() => onOpenCamera(className)}
                  >
                    <Camera size={25} />
                    <p className='text-xs font-semibold'>Webcam</p>
                  </div>
                </div>
                {/* Image preview grid */}
                <div className='mt-4 mb-4 flex gap-2.5 overflow-x-auto'>
                  {classImages[className]?.map((imageSrc, index) => (
                    <div key={index} className='relative flex-shrink-0'>
                      <img
                        src={imageSrc}
                        alt={`${className} ${index + 1}`}
                        className='h-24 w-24 cursor-pointer rounded-lg border-2 border-gray-300 object-cover transition-opacity hover:opacity-75'
                      />
                      <button
                        onClick={() => onRemoveImage(className, index)}
                        className='absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <p className='text-sm text-gray-600'>
                  Đã upload: <span className='font-semibold'>{classImages[className]?.length || 0}</span> ảnh
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='flex max-w-md gap-2.5'>
          <Input
            type='text'
            placeholder='Nhập tên class mới'
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
            className='flex-1 bg-white'
          />
          <Button onClick={handleAddClass} className='bg-[#4facfe] hover:bg-[#3d8bfe]'>
            Thêm class mới
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
