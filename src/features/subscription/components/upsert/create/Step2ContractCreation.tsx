'use client'

import React, { useRef, useState } from 'react'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Textarea } from '@/components/shadcn/textarea'
import { Button } from '@/components/shadcn/button'
import { UploadCloud, FileText } from 'lucide-react'
import { useFileUpload } from '@/components/shared/file/useFileUpload'

type Step2ContractCreationProps = {
  formData: any
  setFormData: (data: any) => void
}

export default function Step2ContractCreation({ formData, setFormData }: Step2ContractCreationProps) {
  const [file, setFile] = useState<File | null>(null)
  const [base64, setBase64] = useState('')
  const { inputRef, handleClick, handleFileChange, handleDrop, handleDragOver, handleDragLeave, accept, isDragging } =
    useFileUpload(
      (file, base64) => {
        setFile(file)
        setBase64(base64)
      },
      'any',
      10
    )

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='mb-4 text-2xl font-bold text-slate-900'>Create Contract</h2>
        <p className='text-slate-600'>Provide contract information and upload the signed document.</p>
      </div>

      {/* Contract Name */}
      <div className='space-y-2'>
        <Label htmlFor='contractName' className='text-sm font-medium text-slate-700'>
          Contract Name <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='contractName'
          placeholder='Enter contract name (e.g. FPT School - Subscription Contract)'
          value={formData.contractName || ''}
          onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
          className='border-slate-300'
        />
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <Label htmlFor='description' className='text-sm font-medium text-slate-700'>
          Description
        </Label>
        <Textarea
          id='description'
          rows={4}
          placeholder='Enter description for the contract'
          value={formData.contractDescription || ''}
          onChange={(e) => setFormData({ ...formData, contractDescription: e.target.value })}
          className='border-slate-300'
        />
      </div>

      {/* File Upload */}
      <div className='space-y-3'>
        <p className='font-medium text-slate-700'>Upload Contract (PDF only)</p>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all ${
            isDragging ? 'border-slate-500 bg-slate-100' : 'border-slate-300 bg-slate-50'
          }`}
        >
          {file ? (
            <>
              <FileText className='h-10 w-10 text-slate-700' />
              <p className='mt-2 text-sm font-medium'>{file.name}</p>
              <p className='text-xs text-slate-500'>{(file.size / 1024).toFixed(1)} KB</p>
              <Button variant='outline' size='sm' className='mt-3' onClick={() => setFile(null)}>
                Remove
              </Button>
            </>
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
        </div>

        <input ref={inputRef} type='file' accept={accept} onChange={handleFileChange} className='hidden' />
      </div>

      {/* Preview (Optional) */}
      {formData.contractFile && (
        <div className='rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700'>
          <strong>Preview:</strong> {formData.contractFile.name}
        </div>
      )}
    </div>
  )
}
