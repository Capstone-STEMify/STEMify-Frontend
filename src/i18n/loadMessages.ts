export async function loadMessages(locale: string) {
  const commonMessages = (await import(`../../messages/${locale}/${locale}_common.json`)).default
  const curriculumMessages = (await import(`../../messages/${locale}/${locale}_curriculum.json`)).default
  const courseMessages = (await import(`../../messages/${locale}/${locale}_course.json`)).default

  const headerMessages = (await import(`../../messages/${locale}/${locale}_header.json`)).default
  const homeMessages = (await import(`../../messages/${locale}/${locale}_home.json`)).default
  const resourceMessages = (await import(`../../messages/${locale}/${locale}_resource.json`)).default
  const myLearningMessages = (await import(`../../messages/${locale}/${locale}_myLearning.json`)).default
  const lessonListMessages = (await import(`../../messages/${locale}/${locale}_lessonList.json`)).default
  const lessonDetailsMessages = (await import(`../../messages/${locale}/${locale}_lessonDetails.json`)).default
  const lessonManagementMessages = (await import(`../../messages/${locale}/${locale}_lessonManagement.json`)).default
  const sectionManagementMessages = (await import(`../../messages/${locale}/${locale}_sectionManagement.json`)).default
  const pacingGuideMessages = (await import(`../../messages/${locale}/${locale}_pacingGuide.json`)).default
  const adminMessages = (await import(`../../messages/${locale}/${locale}_admin.json`)).default
  const profileMessages = (await import(`../../messages/${locale}/${locale}_profile.json`)).default
  const learningOutcomeMessages = (await import(`../../messages/${locale}/${locale}_learningOutcome.json`)).default

  return {
    ...commonMessages,
    ...curriculumMessages,
    ...courseMessages,

    ...headerMessages,
    ...homeMessages,
    ...resourceMessages,
    ...myLearningMessages,
    ...lessonListMessages,
    ...lessonDetailsMessages,
    ...lessonManagementMessages,
    ...sectionManagementMessages,
    ...pacingGuideMessages,
    ...adminMessages,
    ...profileMessages,
    ...learningOutcomeMessages
  }
}
