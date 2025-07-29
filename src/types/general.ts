export type Size = 'sm' | 'md' | 'lg' | 'xl'

export type AvatarProps = {
  image: string
  fallback: string
  className?: string
}

// Modal
export type ModalType =
  | null
  | 'userForm'
  | 'confirm'
  | 'profile'
  | 'image'
  | 'enroll'
  | 'editImage'
  | 'upsertSection'
  | 'upsertLesson'

export interface ModalContextType {
  openModal: (type: ModalType, props?: any) => void
  closeModal: () => void
  modalType: ModalType
  modalProps: any
}
