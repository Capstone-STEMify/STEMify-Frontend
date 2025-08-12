export async function loadMessages(locale: string) {
  const headerMessages = (await import(`../../messages/${locale}/${locale}_header.json`)).default;
  const homeMessages = (await import(`../../messages/${locale}/${locale}_home.json`)).default;
  const resourceMessages = (await import(`../../messages/${locale}/${locale}_resource.json`)).default;
  const myLearningMessages = (await import(`../../messages/${locale}/${locale}_myLearning.json`)).default;
  const courseListMessages = (await import(`../../messages/${locale}/${locale}_courseList.json`)).default;
  const lessonListMessages = (await import(`../../messages/${locale}/${locale}_lessonList.json`)).default;
  const courseDetailMessages = (await import(`../../messages/${locale}/${locale}_courseDetails.json`)).default;
  const lessonDetailsMessages = (await import(`../../messages/${locale}/${locale}_lessonDetails.json`)).default;

  return {
    ...headerMessages,
    ...homeMessages,
    ...resourceMessages,
    ...myLearningMessages,
    ...courseListMessages,
    ...lessonListMessages,
    ...courseDetailMessages,
    ...lessonDetailsMessages,
  };
}
