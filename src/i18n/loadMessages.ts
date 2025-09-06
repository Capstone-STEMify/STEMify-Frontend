export async function loadMessages(locale: string) {
  const commonMessages = (await import(`../../messages/${locale}/common/${locale}_common.json`)).default
  const toastMessages = (await import(`../../messages/${locale}/common/${locale}_toast.json`)).default
  const validMessages = (await import(`../../messages/${locale}/common/${locale}_validation.json`)).default
  const popupMessage = (await import(`../../messages/${locale}/common/${locale}_message.json`)).default

  const curriculumMessages = (await import(`../../messages/${locale}/curriculum/${locale}_curriculum.json`)).default
  const courseMessages = (await import(`../../messages/${locale}/course/${locale}_course.json`)).default
  const headerMessages = (await import(`../../messages/${locale}/header/${locale}_header.json`)).default
  const tableHeaderMessages = (await import(`../../messages/${locale}/header/${locale}_tableHeader.json`)).default
  const homeMessages = (await import(`../../messages/${locale}/home/${locale}_home.json`)).default
  const resourceMessages = (await import(`../../messages/${locale}/resource/${locale}_resource.json`)).default
  const myLearningMessages = (await import(`../../messages/${locale}/user/${locale}_myLearning.json`)).default
  const lessonListMessages = (await import(`../../messages/${locale}/lesson/${locale}_lessonList.json`)).default
  const lessonDetailsMessages = (await import(`../../messages/${locale}/lesson/${locale}_lessonDetails.json`)).default
  const pacingGuideMessages = (await import(`../../messages/${locale}/lesson/${locale}_pacingGuide.json`)).default
  const adminMessages = (await import(`../../messages/${locale}/admin/${locale}_admin.json`)).default
  const profileMessages = (await import(`../../messages/${locale}/user/${locale}_profile.json`)).default
  const learningOutcomeMessages = (await import(`../../messages/${locale}/curriculum/${locale}_learningOutcome.json`))
    .default
  const sectionMessages = (await import(`../../messages/${locale}/lesson/${locale}_section.json`)).default

  return {
    ...commonMessages,
    ...toastMessages,
    ...validMessages,
    ...curriculumMessages,
    ...courseMessages,
    ...headerMessages,
    ...tableHeaderMessages,
    ...homeMessages,
    ...resourceMessages,
    ...myLearningMessages,
    ...lessonListMessages,
    ...lessonDetailsMessages,
    ...pacingGuideMessages,
    ...adminMessages,
    ...profileMessages,
    ...learningOutcomeMessages,
    ...sectionMessages
  }
}
