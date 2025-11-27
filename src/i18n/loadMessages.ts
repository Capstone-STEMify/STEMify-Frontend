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
  const kitMessages = (await import(`../../messages/${locale}/product/${locale}_kit.json`)).default
  const contentMessages = (await import(`../../messages/${locale}/lesson/${locale}_content.json`)).default
  const planMessages = (await import(`../../messages/${locale}/product/${locale}_plan.json`)).default
  const componentMessages = (await import(`../../messages/${locale}/product/${locale}_component.json`)).default
  const workspace3DMessages = (await import(`../../messages/${locale}/3d/${locale}_3d.json`)).default
  const cartMessages = (await import(`../../messages/${locale}/product/${locale}_cart.json`)).default
  const subscriptionMessages = (await import(`../../messages/${locale}/subscription/${locale}_subscription.json`))
    .default
  const contactMessages = (await import(`../../messages/${locale}/contact/${locale}_contact.json`)).default
  const organizationMessages = (await import(`../../messages/${locale}/organization/${locale}_organization.json`))
    .default
  const dashboardMessages = await import(`../../messages/${locale}/dashboard/${locale}_dashboard.json`)
  const classroomMessages = (await import(`../../messages/${locale}/classroom/${locale}_classroom.json`)).default
  const assignmentMessages = (await import(`../../messages/${locale}/assignment/${locale}_assignment.json`)).default
  const quizMessages = (await import(`../../messages/${locale}/quiz/${locale}_quiz.json`)).default
  const agentMessages = (await import(`../../messages/${locale}/agent/${locale}_agent.json`)).default

  return {
    ...commonMessages,
    ...toastMessages,
    ...validMessages,
    ...popupMessage,
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
    ...sectionMessages,
    ...kitMessages,
    ...contentMessages,
    ...planMessages,
    ...componentMessages,
    ...workspace3DMessages,
    ...cartMessages,
    ...subscriptionMessages,
    ...contactMessages,
    ...organizationMessages,
    ...dashboardMessages,
    ...classroomMessages,
    ...assignmentMessages,
    ...quizMessages,
    ...agentMessages
  }
}
