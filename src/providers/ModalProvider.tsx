'use client'

import React, { createContext, useContext, useState } from 'react'
import { ModalType, ModalContextType } from '@/types/general'

import ConfirmModal from '@/components/shared/modals/ConfirmModal'
import UserFormModal from '@/components/shared/modals/UserFormModal'
import PhotoUploadModal from '@/components/shared/modals/UploadImageModal'
import EnrollModal from '@/components/shared/modals/EnrollModal'
import EditImageModal from '@/components/shared/modals/EditImageModal'
import UpsertSectionModal from '@/components/shared/modals/UpsertSectionModal'
import UpsertLessonModal from '@/components/shared/modals/UpsertLessonModal'

const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  modalType: null,
  modalProps: {}
})

export const useModal = () => useContext(ModalContext)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null)
  const [modalProps, setModalProps] = useState<any>({})

  const openModal = (type: ModalType, props?: any) => {
    setModalType(type)
    setModalProps(props || {})
  }

  const closeModal = () => {
    setModalType(null)
    setModalProps({})
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType, modalProps }}>
      {children}

      {/* Add modal here */}
      {modalType === 'userForm' && <UserFormModal {...modalProps} />}
      {modalType === 'confirm' && <ConfirmModal {...modalProps} />}
      {modalType === 'image' && <PhotoUploadModal {...modalProps} />}
      {modalType === 'enroll' && <EnrollModal {...modalProps} />}
      {modalType === 'editImage' && <EditImageModal {...modalProps} />}
      {modalType === 'upsertLesson' && <UpsertLessonModal {...modalProps} />}
      {modalType === 'upsertSection' && <UpsertSectionModal {...modalProps} />}
    </ModalContext.Provider>
  )
}
// use everywhere in your app to open modals
// example
// const { openModal } = useModal()
// openModal('confirm', { message: 'Are you sure?' })
// openModal('userForm')
