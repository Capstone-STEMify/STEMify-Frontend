'use client'

import React, { createContext, useContext, useState } from 'react'
import { ModalType, ModalContextType } from '@/types/general'

import GenericFormModal from '@/components/shared/modals/GenericFormModal'
import ConfirmModal from '@/components/shared/modals/ConfirmModal'
import PreviewModal from '@/components/shared/modals/PreviewModal'

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

      {modalType === 'form' && <GenericFormModal {...modalProps} />}
      {modalType === 'confirm' && <ConfirmModal {...modalProps} />}
      {modalType === 'preview' && <PreviewModal {...modalProps} />}
    </ModalContext.Provider>
  )
}
// use everywhere in your app to open modals
// example
// const { openModal } = useModal()
// openModal('form', { defaultValues: { title: 'New Form' } })
// openModal('confirm', { message: 'Are you sure?' })
// openModal('preview', { data: { title: 'Preview Title', content: 'Preview Content' } })
