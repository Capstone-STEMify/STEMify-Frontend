'use client'

import { useModal } from '@/components/shared/modals/ModalProvider'

export default function BreadcrumbResponsive() {
  const { openModal } = useModal()

  return (
    <div>
      <button onClick={() => openModal('form', { defaultValues: 'form value test' })}>📝 Edit</button>
      <button
        onClick={() =>
          openModal('confirm', {
            message: 'Delete this item?',
            onConfirm: () => console.log('Deleted')
          })
        }
      >
        ❌ Delete
      </button>
      <button onClick={() => openModal('preview', { data: 'sss' })}>👁️ View</button>
    </div>
  )
}
