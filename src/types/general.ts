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
  | 'information'
  | 'success'

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
  | 'upsertKit'
  | 'upsertComponent'
  | 'upsertOrganization'
  | 'upsertClassroom'

  // detail
  | 'lessonDetail'
  | 'contentDetail'

  // organization
  | 'uploadCSV'

  // orther
  | 'pacingGuide'
  | 'curriculumSelectCourseListModal'
  | 'kitListTableModal'
  | 'selectComponentListModal'
  | 'upsertAssembly'
  | 'quizAI'

  // sheet
  | 'upsertContact'
  | 'upsertPlan'
export interface ModalContextType {
  openModal: (type: ModalType, props?: any) => void
  closeModal: () => void
  modalType: ModalType
  modalProps: any
}
