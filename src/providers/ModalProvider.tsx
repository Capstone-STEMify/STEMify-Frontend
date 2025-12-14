'use client'

import React, { createContext, useContext, useState } from 'react'
import { ModalType, ModalContextType } from '@/types/general'

import ConfirmModal from '@/components/shared/modals/ConfirmModal'
import UserFormModal from '@/components/shared/modals/UserFormModal'
import PhotoUploadModal from '@/components/shared/modals/UploadImageModal'
import EnrollModal from '@/components/shared/modals/EnrollModal'
import EditImageModal from '@/components/shared/modals/EditImageModal'
import UpsertSectionModal from '@/features/resource/section/components/upsert/UpsertSectionModal'
import UpsertLessonModal from '@/features/resource/lesson/components/upsert/UpsertLessonModal'
import UpsertCategoryModal from '@/features/resource/category/components/upsert/UpsertCategoryModal'
import UpsertAgeRangeModal from '@/features/resource/age-range/components/upsert/UpsertAgeRangeModal'
import UpsertStandardModal from '@/features/resource/standard/components/upsert/UpsertStandardModal'
import UpsertSkillModal from '@/features/resource/skill/components/upsert/UpsertSkillModal'
import LessonDetailModal from '@/features/resource/lesson/components/detail/LessonDetailModal'
import UpsertUserModal from '@/components/shared/modals/UpsertUserModal'
import UpsertLearningOutcomeModal from '@/features/resource/learning-outcome/components/upsert/UpsertLearningOutcomeModal'
import UpsertCurriculumModal from '@/features/resource/curriculum/components/upsert/UpsertCurriculumModal'
import CurriculumSelectCourseListModal from '@/features/resource/curriculum/components/modal/CurriculumSelectCourseListModal'
import UpsertCourseModal from '@/features/resource/course/components/modal/UpsertCourseModal'
import ContentDetailModal from '@/features/resource/content/components/detail/ContentDetailModal'
import UpsertContentModal from '@/features/resource/content/components/upsert/UpsertContentModal'
import UpsertKitModal from '@/features/resource/kit/components/upsert/UpsertKitModal'
import PacingGuideModal from '@/features/resource/lesson/components/modal/PacingGuideModal'
import KitListTableModal from '@/features/resource/kit/components/list/KitListTableModal'
import InformationModal from '@/components/shared/modals/InformationModal'
import UpsertComponentModal from '@/features/kit-components/components/upsert/UpsertComponentModal'
import SelectComponentListModal from '@/features/kit-components/components/list/SelectComponentListModal'
import UploadCSVModal from '@/features/license-assignment/components/modal/UploadCSVModal'
import QuizAIModal from '@/features/resource/quiz/components/modal/QuizAIModal'
import ContactDetailSheet from '@/features/contact/components/detail/ContactDetailSheet'
import UpsertPlanSheet from '@/features/plan/components/sheet/UpsertPlanSheet'
import UpsertClassroomModal from '@/features/classroom/components/upsert/UpsertClassroomModal'
import SuccessModal from '@/components/shared/modals/SuccessModal'
import AddPeopleModal from '@/features/user/components/modal/AddPeopleModal'
import UpsertOrganizationModal from '@/features/organization/components/upsert/UpsertOrganizationModal'
import UpdateSubsctiptionSheet from '@/features/subscription/components/upsert/UpdateSubsctiptionSheet'
import UpdateClassroomOrganizationModal from '@/features/classroom/components/upsert/UpdateClassroomOrganizationModal'
import { UpsertEmulator } from '@/features/creator-3d/components/creator3d/ExportDialog'
import QuizCSVUploadModal from '@/features/resource/quiz/components/modal/QuizCSVUploadModal'
import SectionAIModal from '@/features/chat/components/SectionAIModal'
import AssignmentCSVUploadModal from '@/features/assignment/components/detail/modal/AssignmentCSVUploadModal'
import CreateAssignmentInfoModal from '@/features/assignment/components/upsert/CreateAssignmentInfoModal'
import UpsertGroupModal from '@/features/group/components/modal/UpsertGroupModal'
import UpdateGroupModal from '@/features/group/components/modal/UpdateGroupModal'
import CreateQuizModal from '@/features/resource/quiz/components/modal/CreateQuizModal'
import { UpsertStudentGroup } from '@/features/group/components/upsert/UpsertStudentGroup'
import AddStudentToGroupModal from '@/features/group/components/upsert/AddStudentToGroupModal'
import CurriculumSelectEmulatorListModal from '@/features/resource/curriculum/components/modal/CurriculumSelectEmulatorListModal'
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
      {/* general */}
      {modalType === 'userForm' && <UserFormModal {...modalProps} />}
      {modalType === 'confirm' && <ConfirmModal {...modalProps} />}
      {modalType === 'image' && <PhotoUploadModal {...modalProps} />}
      {modalType === 'enroll' && <EnrollModal {...modalProps} />}
      {modalType === 'editImage' && <EditImageModal {...modalProps} />}
      {modalType === 'information' && <InformationModal {...modalProps} />}
      {modalType === 'success' && <SuccessModal {...modalProps} />}

      {/* upsert */}
      {modalType === 'upsertLesson' && <UpsertLessonModal {...modalProps} />}
      {modalType === 'upsertSection' && <UpsertSectionModal {...modalProps} />}
      {modalType === 'upsertCategory' && <UpsertCategoryModal {...modalProps} />}
      {modalType === 'upsertAgeRange' && <UpsertAgeRangeModal {...modalProps} />}
      {modalType === 'upsertStandard' && <UpsertStandardModal {...modalProps} />}
      {modalType === 'upsertSkill' && <UpsertSkillModal {...modalProps} />}
      {modalType === 'upsertUser' && <UpsertUserModal {...modalProps} />}
      {modalType === 'upsertLearningOutcome' && <UpsertLearningOutcomeModal {...modalProps} />}
      {modalType === 'upsertCurriculum' && <UpsertCurriculumModal {...modalProps} />}
      {modalType === 'upsertCourse' && <UpsertCourseModal {...modalProps} />}
      {modalType === 'upsertContent' && <UpsertContentModal {...modalProps} />}
      {modalType === 'upsertKit' && <UpsertKitModal {...modalProps} />}
      {modalType === 'upsertComponent' && <UpsertComponentModal {...modalProps} />}
      {modalType === 'upsertPlan' && <UpsertPlanSheet {...modalProps} />}
      {modalType === 'upsertClassroom' && <UpsertClassroomModal {...modalProps} />}
      {modalType === 'upsertOrganization' && <UpsertOrganizationModal {...modalProps} />}
      {modalType === 'upsertEmulator' && <UpsertEmulator {...modalProps} />}
      {modalType === 'createAssignmentInfo' && <CreateAssignmentInfoModal {...modalProps} />}
      {modalType === 'upsertGroup' && <UpsertGroupModal {...modalProps} />}
      {modalType === 'updateGroup' && <UpdateGroupModal {...modalProps} />}
      {modalType === 'createQuiz' && <CreateQuizModal {...modalProps} />}
      {modalType === 'upsertStudentGroup' && <UpsertStudentGroup {...modalProps} />}
      {modalType === 'addStudentToGroup' && <AddStudentToGroupModal {...modalProps} isUpdate />}

      {/* detail */}
      {modalType === 'lessonDetail' && <LessonDetailModal {...modalProps} />}
      {modalType === 'contentDetail' && <ContentDetailModal {...modalProps} />}

      {/* organization */}
      {modalType === 'uploadCSV' && <UploadCSVModal {...modalProps} />}

      {/* other */}
      {modalType === 'pacingGuide' && <PacingGuideModal {...modalProps} />}
      {modalType === 'curriculumSelectCourseListModal' && <CurriculumSelectCourseListModal {...modalProps} />}
      {modalType === 'curriculumSelectEmulatorListModal' && <CurriculumSelectEmulatorListModal {...modalProps} />}
      {modalType === 'kitListTableModal' && <KitListTableModal {...modalProps} />}
      {modalType === 'selectComponentListModal' && <SelectComponentListModal {...modalProps} />}
      {modalType === 'quizAI' && <QuizAIModal {...modalProps} />}
      {modalType === 'addPeople' && <AddPeopleModal {...modalProps} />}
      {modalType === 'importQuiz' && <QuizCSVUploadModal {...modalProps} />}
      {modalType === 'sectionAI' && <SectionAIModal {...modalProps} />}
      {modalType === 'importAssignment' && <AssignmentCSVUploadModal {...modalProps} />}

      {/* sheet */}
      {modalType === 'upsertContact' && <ContactDetailSheet {...modalProps} />}
      {modalType === 'upsertPlan' && <UpsertPlanSheet {...modalProps} />}
      {modalType === 'upsertSubscription' && <UpdateSubsctiptionSheet {...modalProps} />}

      {/* classroom */}
      {modalType === 'updateClassroomOrganization' && <UpdateClassroomOrganizationModal {...modalProps} />}
    </ModalContext.Provider>
  )
}
// use everywhere in your app to open modals
// example
// const { openModal } = useModal()
// openModal('confirm', { message: 'Are you sure?' })
// openModal('userForm')
