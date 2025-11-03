'use client'

import ManualEntryTab from '@/features/license-assignment/components/modal/ManualEntryTab'
import { LicenseAssignmentType } from '@/features/license-assignment/types/licenseAssignment'
import { useModal } from '@/providers/ModalProvider'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function Step4AdminAccounts() {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const locale = useLocale()

  const handleOpenModal = () => {
    openModal('success', {
      onClose: () => {
        closeModal()
        router.push(`/${locale}/admin/organization-subscription`)
      }
    })
  }

  return (
    <div>
      <ManualEntryTab
        isStep={true}
        openModal={handleOpenModal}
        userType={LicenseAssignmentType.ORGANIZATION_ADMIN}
        labelButton='Finish'
      />
    </div>
  )
}
