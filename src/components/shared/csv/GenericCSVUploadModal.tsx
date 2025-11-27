'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import UploadCSV from '@/components/shared/csv/UploadCSV'

interface UploadedFile {
  name: string
  size?: number
  file: File
}

export interface CSVUploadModalProps {
  title: string
  onSubmit: (file: File) => Promise<void>
  isLoading?: boolean
  successMessage?: string
  errorMessage?: string
  templateData?: string
  templateFileName?: string
  headerTitle?: string
  headerDescription?: string
}

export default function GenericCSVUploadModal({
  title,
  onSubmit,
  isLoading = false,
  successMessage,
  errorMessage,
  templateData,
  templateFileName,
  headerTitle,
  headerDescription
}: CSVUploadModalProps) {
  const tc = useTranslations('common')
  const tv = useTranslations('validation')

  const { closeModal } = useModal()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)

  const handleFileChange = (file: File | null) => {
    if (file) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        file: file
      })
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast.error(tv('uploadCSV.required'))
      return
    }

    try {
      await onSubmit(uploadedFile.file)
      toast.success(successMessage || 'Upload successful')
      closeModal()
    } catch (error: any) {
      toast.error(error?.data?.message || errorMessage || 'Failed to upload CSV')
    }
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-xl'>
        <DialogTitle>{title}</DialogTitle>

        <div className='space-y-4'>
          <UploadCSV
            onFileChange={handleFileChange}
            uploadedFile={uploadedFile}
            onRemoveFile={handleRemoveFile}
            templateData={templateData}
            templateFileName={templateFileName}
            headerTitle={headerTitle}
            headerDescription={headerDescription}
          />

          <div className='flex justify-end gap-2 border-t pt-4'>
            <Button variant='outline' onClick={closeModal}>
              {tc('button.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!uploadedFile || isLoading}
              className='bg-sky-500 hover:bg-sky-600'
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
                  {tc('button.submitting')}
                </span>
              ) : (
                tc('button.save')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
