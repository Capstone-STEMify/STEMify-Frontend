'use client'

import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/cropImageHelper'
import { useModal } from '@/providers/ModalProvider'

type EditImageModalProps = {
  imageSrc: string
  onConfirm: (croppedFile: File) => void
}

export default function EditImageModal({ imageSrc, onConfirm }: EditImageModalProps) {
  const { closeModal } = useModal()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<import('react-easy-crop').Area | null>(null)

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleSave = async () => {
    if (!croppedAreaPixels) return
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const croppedFile = new File([croppedBlob], 'cropped-image.png', { type: 'image/png' })
    onConfirm(croppedFile)
    closeModal()
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>
        <div className='relative h-[400px] w-md rounded bg-gray-200'>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <DialogFooter className='flex justify-end gap-2 pt-4'>
          <Button variant='outline' onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
