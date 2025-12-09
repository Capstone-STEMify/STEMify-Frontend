'use client'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import UploadCSV from '@/features/license-assignment/components/modal/UploadCSV'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { goBack } from '@/features/subscription/slice/organizationSubscriptionFormSlice'
import { useUploadCSVBulkMutation } from '@/features/license-assignment/api/licenseAssignmentApi'
import { useParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface UploadedFile {
  name: string
  size?: number
  file: File
}

export default function Step2AdminAccounts() {
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const dispatch = useAppDispatch()
  const router = useRouter()
  const locale = useLocale()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploadCSVBulk, { isLoading }] = useUploadCSVBulkMutation()
  const { organizationId } = useParams()
  const { organizationSubscriptionId } = useAppSelector((state) => state.organizationSubscriptionForm)

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
      toast.error('Please upload a CSV file')
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const csvBase64 = (event.target?.result as string).split(',')[1]

        const payload = {
          organization_id: String(organizationId),
          body: {
            organization_id: String(organizationId),
            csv_data: csvBase64,
            file_name: uploadedFile.file.name,
            subscription_order_id: String(organizationSubscriptionId)
          }
        }

        const res = await uploadCSVBulk(payload).unwrap()
        toast.success(tt('successMessage.uploadCSV'))
        router.push(`/${locale}/admin/organization/${organizationId}/subscription/${organizationSubscriptionId}`)
        // Handle success (e.g., navigate to next step)
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to upload CSV')
      }
    }

    reader.readAsDataURL(uploadedFile.file)
  }

  const handleSkip = () => {
    router.push(`/${locale}/admin/organization/${organizationId}/subscription/${organizationSubscriptionId}`)
  }

  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full'>
        <UploadCSV onFileChange={handleFileChange} uploadedFile={uploadedFile} onRemoveFile={handleRemoveFile} />

        {/* Action Buttons */}
        <div className='mt-5 flex justify-between'>
          <Button variant='outline' onClick={() => dispatch(goBack())}>
            {tc('button.back')}
          </Button>
          <div className='flex w-full justify-end gap-2'>
            <Button variant='outline' onClick={handleSkip}>
              {tc('button.skip')}
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
                tc('button.add')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
