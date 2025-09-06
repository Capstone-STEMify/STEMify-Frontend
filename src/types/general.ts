export type Size = 'sm' | 'md' | 'lg' | 'xl'

export type AvatarProps = {
  image: string
  fallback: string
  className?: string
}

// Modal
export type ModalType =
  | null

  // general
  | 'userForm'
  | 'confirm'
  | 'profile'
  | 'image'
  | 'enroll'
  | 'editImage'

  // upsert
  | 'upsertCourse'
  | 'upsertLesson'
  | 'upsertSection'
  | 'upsertCategory'
  | 'upsertAgeRange'
  | 'upsertStandard'
  | 'upsertSkill'
  | 'upsertUser'
  | 'upsertLearningOutcome'
  | 'upsertCurriculum'
  | 'upsertContent'

  // detail
  | 'lessonDetail'
  | 'contentDetail'

  // orther
  | 'curriculumSelectCourseListModal'
export interface ModalContextType {
  openModal: (type: ModalType, props?: any) => void
  closeModal: () => void
  modalType: ModalType
  modalProps: any
}
