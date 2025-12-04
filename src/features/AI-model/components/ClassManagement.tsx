import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useState } from 'react'
import { Camera, Edit, Edit2, Trash2, Webcam } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ClassManagementProps {
  classes: string[]
  onAddNewClass: (className: string) => void
  onEditClassName: (oldName: string, newName: string) => void
  classImages: Record<string, string[]>
  onOpenCamera: (className: string) => void
  onRemoveImage: (className: string, index: number) => void
  onRemoveClass: (className: string) => void
}

export function ClassManagement({
  classes,
  onAddNewClass,
  classImages,
  onOpenCamera,
  onRemoveImage,
  onEditClassName,
  onRemoveClass
}: ClassManagementProps) {  
  const t = useTranslations('agent.modelMaker')
  const tc = useTranslations('common')

  const [newClassName, setNewClassName] = useState('')
  const [editingClass, setEditingClass] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')

  const handleAddClass = () => {
    if (newClassName.trim()) {
      onAddNewClass(newClassName.trim())
      setNewClassName('')
    }
  }
  const handleStartEdit = (className: string) => {
    setEditingClass(className)
    setEditedName(className)
  }

  const handleSaveEdit = (oldName: string) => {
    if (!editedName.trim()) return
    if (editedName !== oldName) onEditClassName(oldName, editedName.trim())
    setEditingClass(null)
  }

  return (
    <Card className='border-2 border-gray-200 py-4 shadow-md'>
      <CardHeader>
        <CardTitle className='text-2xl'>{t('classCreate')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-5 grid grid-cols-1 gap-5 md:grid-cols-2'>
          {classes.map((className) => (
            <Card key={className} className='border-2 border-gray-200 py-4'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  {editingClass === className ? (
                    <Input
                      value={editedName}
                      autoFocus
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(className)}
                      onBlur={() => handleSaveEdit(className)}
                      className='w-48 text-sm'
                    />
                  ) : (
                    <>
                      {className}
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleStartEdit(className)}
                        className='ml-1 text-gray-600 hover:text-blue-600'
                      >
                        <Edit2 size={16} />
                      </Button>
                    </>
                  )}
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onRemoveClass(className)}
                    className='text-gray-600 hover:text-red-600'
                  >
                    <Trash2 size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className='flex cursor-pointer gap-2.5'>
                  <div
                    className='flex flex-col items-center gap-1 rounded-md bg-blue-50 p-3 text-blue-600 hover:bg-blue-100'
                    onClick={() => onOpenCamera(className)}
                  >
                    <Camera size={25} />
                    <p className='text-xs font-semibold'>Webcam</p>
                  </div>
                </div>

                {/* Image preview grid */}
                <div className='mt-4 mb-2 flex gap-2.5 overflow-x-auto'>
                  {classImages[className]?.map((imageSrc, index) => (
                    <div key={index} className='relative flex-shrink-0'>
                      <img
                        src={imageSrc}
                        alt={`${className} ${index + 1}`}
                        className='h-24 w-24 cursor-pointer rounded-lg border-2 border-gray-300 object-cover transition-opacity hover:opacity-75'
                      />
                      <button
                        onClick={() => onRemoveImage(className, index)}
                        className='absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600'
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <p className='text-sm text-gray-600'>
                  {t('uploaded', {images: classImages[className]?.length || 0})}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add new class */}
        <div className='flex max-w-md gap-2.5'>
          <Input
            type='text'
            placeholder={t('newClass')}
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
            className='flex-1 bg-white'
          />
          <Button onClick={handleAddClass} className='bg-[#4facfe] hover:bg-[#3d8bfe]'>
            {tc('button.createClass')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
