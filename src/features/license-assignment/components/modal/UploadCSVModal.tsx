'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { useModal } from '@/providers/ModalProvider'
import UploadCSV from '@/features/license-assignment/components/modal/UploadCSV'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import ManualEntryTab from '@/features/license-assignment/components/modal/ManualEntryTab'
import { useUploadCSVBulkMutation } from '@/features/license-assignment/api/licenseAssignmentApi'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAppSelector } from '@/hooks/redux-hooks'

export type UploadCSVModalProps = {
  organizationSubscriptionOrderId?: number
}

interface UploadedFile {
  name: string
  size?: number
  file: File
}

export default function UploadCSVModal({ organizationSubscriptionOrderId }: UploadCSVModalProps) {
  const tc = useTranslations('common')
  const to = useTranslations('organization.license')
  const { organizationId } = useParams()
  const organizationIdFromStore = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const finalOrganizationId = organizationId || organizationIdFromStore

  const { closeModal } = useModal()
  const [activeTab, setActiveTab] = useState('csv')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploadCSVBulk, { isLoading }] = useUploadCSVBulkMutation()

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

  const handleSubmitCSV = async () => {
    if (!uploadedFile) {
      toast.error(to('pleaseUploadCSV'))
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const csvBase64 = (event.target?.result as string).split(',')[1]

        const payload = {
          organization_id: String(finalOrganizationId),
          body: {
            organization_id: String(finalOrganizationId),
            csv_data: csvBase64,
            file_name: uploadedFile.file.name,
            subscription_order_id: String(organizationSubscriptionOrderId)
          }
        }

        const res = await uploadCSVBulk(payload).unwrap()
        toast.success(to('uploadSuccess'))
        closeModal()
      } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to upload CSV')
      }
    }

    reader.onerror = () => {
      toast.error('Failed to read file')
    }

    reader.readAsDataURL(uploadedFile.file)
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-xl'>
        <DialogTitle>{to('inviteUsers')}</DialogTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='mb-4 w-full'>
            <TabsTrigger value='csv' className='flex-1'>
              {to('uploadCSV')}
            </TabsTrigger>
            <TabsTrigger value='manual' className='flex-1'>
              {to('enterEmails')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='csv' className='space-y-4'>
            <UploadCSV onFileChange={handleFileChange} uploadedFile={uploadedFile} onRemoveFile={handleRemoveFile} />

            {/* Action Buttons for CSV Tab */}
            <div className='flex justify-end gap-2 border-t pt-4'>
              <Button variant='outline' onClick={closeModal}>
                {tc('button.cancel')}
              </Button>
              <Button
                onClick={handleSubmitCSV}
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
          </TabsContent>

          <TabsContent value='manual'>
            <ManualEntryTab organizationSubscriptionOrderId={organizationSubscriptionOrderId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
