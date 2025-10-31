'use client'
import { Dialog, DialogContent } from '@/components/shadcn/dialog'
import UpsertUser from '@/features/user/components/management/UpsertUser'
import { useModal } from '@/providers/ModalProvider'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import React from 'react'

interface UpsertUserModalProps {
  id?: number
  onSuccess?: () => void
}

export default function UpsertUserModal({ id, onSuccess: onConfirm }: UpsertUserModalProps) {
  const { closeModal } = useModal()
  const [isOpen, setIsOpen] = React.useState(true)
  const t = useTranslations('Admin.user')

  // Hàm này được gọi khi form submit thành công
  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false)
    }
  }

  React.useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        closeModal()
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [isOpen, closeModal])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>{id ? t('editTitle') : t('createTitle')}</DialogTitle>
        <UpsertUser id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
