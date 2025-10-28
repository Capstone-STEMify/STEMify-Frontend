'use client'
import React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { useModal } from '@/providers/ModalProvider'
import UploadCSV from '@/features/license-assignment/components/modal/UploadCSV'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import ManualEntryTab from '@/features/license-assignment/components/modal/ManualEntryTab'

export default function UploadCSVModal() {
  const { closeModal } = useModal()

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='h-fit w-full max-w-xl'>
        <DialogTitle>Invite Users</DialogTitle>
        <Tabs defaultValue='csv'>
          <TabsList className='mb-4 w-full'>
            <TabsTrigger value='csv' className='flex-1'>
              Upload CSV
            </TabsTrigger>
            <TabsTrigger value='manual' className='flex-1'>
              Enter Emails
            </TabsTrigger>
          </TabsList>

          <TabsContent value='csv'>
            <UploadCSV />
          </TabsContent>

          <TabsContent value='manual'>
            <ManualEntryTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
