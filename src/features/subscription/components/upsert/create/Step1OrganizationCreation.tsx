import { useState } from 'react'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Upload, X } from 'lucide-react'
export default function Step1OrganizationCreation({ formData, setFormData }: { formData: any; setFormData: any }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, organizationImage: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, organizationImage: null })
    setImagePreview(null)
  }

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
        <div className='flex items-start gap-4'>
          {imagePreview ? (
            <div className='relative'>
              <img
                src={imagePreview || '/placeholder.svg'}
                alt='Organization preview'
                className='h-24 w-24 rounded-lg border-2 border-slate-200 object-cover'
              />
              <button
                type='button'
                onClick={removeImage}
                className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ) : (
            <label
              htmlFor='organizationImage'
              className='flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-slate-400 hover:bg-slate-100'
            >
              <Upload className='h-6 w-6 text-slate-400' />
              <span className='mt-1 text-xs text-slate-500'>Upload</span>
            </label>
          )}
          <input id='organizationImage' type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
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
