import React, { useState, useRef } from 'react'
import { Upload, X, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { goBack } from '@/features/subscription/slice/organizationSubscriptionFormSlice'
import { useUploadCSVBulkMutation } from '@/features/license-assignment/api/licenseAssignmentApi'

interface UploadedFile {
  name: string
  size?: number
  file: File
}
export interface UploadCSVProps {
  organizationSubscriptionOrderId?: number
}

export default function UploadCSV({ organizationSubscriptionOrderId }: UploadCSVProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [urlInput, setUrlInput] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()

  const [uploadCSVBulk] = useUploadCSVBulkMutation()

  const handleSubmit = async (file: File) => {
    const reader = new FileReader()

    reader.onload = async (event) => {
      const csvBase64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve((e.target?.result as string).split(',')[1])
        reader.onerror = () => reject('Failed to read CSV')
        reader.readAsDataURL(file)
      })

      // TODO: Fix Organization ID and Subscription Order ID
      const payload = {
        organization_id: 1,
        body: {
          csv_data: csvBase64,
          file_name: file.name,
          subscription_order_id: organizationSubscriptionOrderId ?? 12
        }
      }
      await uploadCSVBulk(payload).unwrap()
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setUploadedFile({ name: file.name, size: file.size, file })
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleUrlUpload = () => {
    if (!urlInput) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate URL upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadedFile({ name: 'projectname.csv', size: 12345, file: new File([], 'projectname.csv') })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancel = () => {
    setIsUploading(false)
    setUploadProgress(0)
  }

  const formatFileSize = (bytes: number): string => {
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full'>
        <div className='mb-4 rounded-lg border border-blue-100 bg-blue-50/60 p-5 shadow-sm transition-all hover:shadow-md'>
          <h3 className='flex items-center gap-2 text-base font-semibold text-blue-700'>
            <span className='inline-flex h-2 w-2 rounded-full bg-blue-500' />
            Create Organization Account(s)
          </h3>

          <p className='mt-1 text-sm leading-relaxed text-slate-600'>
            New accounts will be created for this organization. The account will automatically be assigned a valid
            license from this subscription.
          </p>
        </div>
        <div
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : uploadedFile && !isUploading
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className='flex flex-col items-center'>
              <div className='relative mb-4 h-16 w-16'>
                <svg className='h-16 w-16 -rotate-90 transform'>
                  <circle cx='32' cy='32' r='28' stroke='#e5e7eb' strokeWidth='4' fill='none' />
                  <circle
                    cx='32'
                    cy='32'
                    r='28'
                    stroke='#3b82f6'
                    strokeWidth='4'
                    fill='none'
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`}
                    strokeLinecap='round'
                    className='transition-all duration-300'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-sm font-semibold text-blue-600'>{uploadProgress}%</span>
                </div>
              </div>
              <p className='mb-3 text-sm text-gray-600'>Uploading file...</p>
              <button onClick={handleCancel} className='text-sm text-blue-600 hover:text-blue-700'>
                Cancel
              </button>
            </div>
          ) : uploadedFile ? (
            <div className='flex flex-col items-center'>
              <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500'>
                <svg className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className='mb-1 text-sm font-medium text-blue-600 hover:text-blue-700'
              >
                Select a CSV file to upload
              </button>
              <p className='text-xs text-gray-500'>or drag and drop it here</p>
              <input ref={fileInputRef} type='file' accept='.csv' onChange={handleFileSelect} className='hidden' />
            </div>
          ) : (
            <div className='flex flex-col items-center'>
              <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
                <Upload className='h-6 w-6 text-gray-400' />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className='mb-1 text-sm font-medium text-blue-600 hover:text-blue-700'
              >
                Select a CSV file to upload
              </button>
              <p className='text-xs text-gray-500'>or drag and drop it here</p>
              <input ref={fileInputRef} type='file' accept='.csv' onChange={handleFileSelect} className='hidden' />
            </div>
          )}
        </div>

        {/* URL Upload Section */}
        <div className='mt-4'>
          <p className='mb-2 text-center text-sm text-gray-600'>Or upload from URL</p>
          <div className='flex gap-2'>
            <Input
              type='text'
              placeholder='Add file URL'
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none'
            />
          </div>
        </div>

        {/* Uploaded File Display */}
        {uploadedFile && !isUploading && (
          <div className='mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3'>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded bg-green-100'>
                <FileSpreadsheet className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>{uploadedFile.name}</p>
                {uploadedFile.size && <p className='text-xs text-gray-500'>{formatFileSize(uploadedFile.size)}</p>}
              </div>
            </div>
            <button onClick={handleRemoveFile} className='text-gray-400 hover:text-gray-600'>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Progress Bar for URL Upload */}
        {isUploading && uploadedFile && (
          <div className='mt-4 rounded-lg border border-gray-200 bg-white p-3'>
            <div className='mb-2 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded bg-green-100'>
                  <FileSpreadsheet className='h-5 w-5 text-green-600' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{uploadedFile.name}</p>
                  {uploadedFile.size && <p className='text-xs text-gray-500'>{formatFileSize(uploadedFile.size)}</p>}
                </div>
              </div>
              <span className='text-xs text-gray-500'>{uploadProgress}%</span>
            </div>
            <div className='h-1.5 w-full rounded-full bg-gray-200'>
              <div
                className='h-1.5 rounded-full bg-blue-600 transition-all duration-300'
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className='mt-5 flex justify-between'>
          <Button variant='outline' onClick={() => dispatch(goBack())}>
            Back
          </Button>
          <div className='flex w-full justify-end gap-2'>
            <Button
              onClick={(e) => {
                e.preventDefault()
                console.log('Clicked Add button')
                if (uploadedFile) {
                  console.log('Uploading file:', uploadedFile.file)
                  handleSubmit(uploadedFile.file)
                }
              }}
              disabled={!uploadedFile}
              className='bg-sky-500 hover:bg-sky-600'
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
