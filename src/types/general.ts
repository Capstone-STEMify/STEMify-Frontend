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
  | 'updateClassroomOrganization'
  | 'upsertEmulator'
  | 'upsertEmulator'
  | 'createAssignmentInfo'
  | 'upsertGroup'
  | 'updateGroup'
  | 'createQuiz'
  | 'upsertStudentGroup'
  | 'addStudentToGroup'

  // detail
  | 'lessonDetail'
  | 'contentDetail'

  // organization
  | 'uploadCSV'

  // orther
  | 'pacingGuide'
  | 'curriculumSelectCourseListModal'
  | 'curriculumSelectEmulatorListModal'
  | 'kitListTableModal'
  | 'selectComponentListModal'
  | 'upsertAssembly'
  | 'quizAI'
  | 'addPeople'
  | 'importQuiz'
  | 'sectionAI'
  | 'importAssignment'

  // sheet
  | 'upsertContact'
  | 'upsertPlan'
  | 'upsertSubscription'

export interface ModalContextType {
  openModal: (type: ModalType, props?: any) => void
  closeModal: () => void
  modalType: ModalType
  modalProps: any
}
