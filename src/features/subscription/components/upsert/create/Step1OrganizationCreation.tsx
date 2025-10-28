import { useState } from 'react'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { FileText, Upload, UploadCloud, X } from 'lucide-react'
import { useFileUpload } from '@/components/shared/file/useFileUpload'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
export default function Step1OrganizationCreation({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [base64, setBase64] = useState('')
  const { inputRef, handleClick, handleFileChange, handleDrop, handleDragOver, handleDragLeave, accept, isDragging } =
    useFileUpload(
      (file, base64) => {
        setFile(file)
        setBase64(base64)
        setFormData({ ...formData, organizationImage: base64 })
      },
      'image',
      10
    )

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-4 text-2xl font-bold text-slate-900'>Create Organization</h2>
        <p className='text-slate-600'>Enter your organization details to get started</p>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='organizationName' className='text-sm font-medium text-slate-700'>
          Organization Name <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='organizationName'
          placeholder='Enter organization name'
          value={formData.organizationName}
          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
          className='border-slate-300'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='organizationImage' className='text-sm font-medium text-slate-700'>
          Organization Image
        </Label>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
            isDragging ? 'border-slate-500 bg-slate-100' : 'border-slate-300 bg-slate-50'
          }`}
        >
          {file ? (
            <div className='group relative flex flex-col items-center justify-center'>
              <div className='relative overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-100 shadow-sm transition-all hover:shadow-md'>
                <Image
                  src={
                    base64
                      ? `data:image/*;base64,${base64}`
                      : formData.organizationImage
                        ? `data:image/*;base64,${formData.organizationImage}`
                        : '/placeholder.svg'
                  }
                  alt='Organization preview'
                  width={192}
                  height={192}
                  className='h-48 w-48 rounded-xl object-cover'
                />

                <button
                  onClick={() => {
                    setFile(null)
                    setBase64('')
                    setFormData({ ...formData, organizationImage: null })
                  }}
                  className='absolute top-2 right-2 hidden rounded-full bg-slate-900/70 p-1.5 text-white transition-all group-hover:block hover:bg-red-500'
                  title='Remove image'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>

              <Button
                variant='outline'
                size='sm'
                onClick={handleClick}
                className='mt-3 w-32 border-slate-300 hover:bg-slate-100'
              >
                Change Image
              </Button>
            </div>
          ) : (
            <>
              <UploadCloud className='mb-2 h-10 w-10 text-slate-500' />
              <p className='mb-2 text-sm text-slate-600'>
                Drag & drop your file here, or <span className='font-medium text-slate-900'>browse</span>
              </p>
              <Button variant='outline' onClick={handleClick}>
                Choose File
              </Button>
            </>
          )}
          <input ref={inputRef} type='file' accept={accept} onChange={handleFileChange} className='hidden' />
          <div className='flex-1'>
            <p className='text-sm text-slate-600'>Upload your organization logo or image</p>
            <p className='mt-1 text-xs text-slate-500'>PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='organizationType' className='text-sm font-medium text-slate-700'>
          Organization Type <span className='text-red-500'>*</span>
        </Label>
        <Select
          value={formData.organizationType}
          onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
        >
          <SelectTrigger id='organizationType' className='border-slate-300'>
            <SelectValue placeholder='Select organization type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='school'>School</SelectItem>
            <SelectItem value='university'>University</SelectItem>
            <SelectItem value='training-center'>Training Center</SelectItem>
            <SelectItem value='corporate'>Corporate</SelectItem>
            <SelectItem value='non-profit'>Non-Profit</SelectItem>
            <SelectItem value='government'>Government</SelectItem>
            <SelectItem value='other'>Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
