import React, { useState, useRef } from 'react'
import { Upload, X, FileSpreadsheet } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface UploadedFile {
  name: string
  size?: number
  file: File
}

export interface UploadCSVProps {
  onFileChange?: (file: File | null) => void
  uploadedFile?: UploadedFile | null
  onRemoveFile?: () => void
  templateData?: string
  templateFileName?: string
  showHeader?: boolean
  headerTitle?: string
  headerDescription?: string
}

export default function UploadCSV({
  onFileChange,
  uploadedFile: externalFile,
  onRemoveFile,
  templateData,
  templateFileName = 'template.csv',
  showHeader = true,
  headerTitle,
  headerDescription
}: UploadCSVProps) {
  const to = useTranslations('organization.license')
  const tc = useTranslations('common')
  const tv = useTranslations('validation')

  const [isDragging, setIsDragging] = useState<boolean>(false)

  const [internalFile, setInternalFile] = useState<UploadedFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadedFile = externalFile !== undefined ? externalFile : internalFile

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
      toast.error(tv('uploadCSV.required'))
      return
    }

    const newFile = { name: file.name, size: file.size, file }

    if (externalFile !== undefined && onFileChange) {
      onFileChange(file)
    } else {
      setInternalFile(newFile)
    }
  }

  const handleRemoveFile = () => {
    if (externalFile !== undefined && onRemoveFile) {
      onRemoveFile()
    } else {
      setInternalFile(null)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  const handleDownloadTemplate = () => {
    const defaultCSV = `email,firstName,lastName,role,license_type,class_id,external_id
myltse180@gmail.com,My,Lam Tieu,OrganizationAdmin,OrganizationLic,STEM03,S003
tieumy lam@gmail.com,Rosie,Shine,Teacher,TeacherLic,STEM04,S004
datkk1120@gmail.com,Leo,kk,Student,StudentLic,STEM05,S005
dattse18@gmail.com,Dat,Tran,Student,StudentLic,STEM06,S006`

    const csvContent = templateData || defaultCSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', templateFileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='w-full'>
      {showHeader && (
        <div className='mb-4 rounded-lg border border-blue-100 bg-blue-50/60 p-5 shadow-sm transition-all hover:shadow-md'>
          <h3 className='flex items-center gap-2 text-base font-semibold text-blue-700'>
            <span className='inline-flex h-2 w-2 rounded-full bg-blue-500' />
            {headerTitle || to('header')}
          </h3>
          <p className='mt-1 text-sm leading-relaxed text-slate-600'>{headerDescription || to('description')}</p>
        </div>
      )}

      {templateData && (
        <div className='my-4 flex items-center justify-center'>
          <button
            onClick={handleDownloadTemplate}
            className='flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700'
          >
            <FileSpreadsheet className='h-4 w-4' />
            {to('downloadCSVTemplate')}
          </button>
        </div>
      )}

      <div
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : uploadedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
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
              {to('uploadCSV')}
            </button>
            <p className='text-xs text-gray-500'>{to('dragAndDrop')}</p>
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
              {to('uploadCSV')}
            </button>
            <p className='text-xs text-gray-500'>{to('dragAndDrop')}</p>
            <input ref={fileInputRef} type='file' accept='.csv' onChange={handleFileSelect} className='hidden' />
          </div>
        )}
      </div>

      {uploadedFile && (
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
    </div>
  )
}
