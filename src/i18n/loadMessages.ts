export async function loadMessages(locale: string) {
  const headerMessages = (await import(`../../messages/${locale}/${locale}_header.json`)).default;
  const homeMessages = (await import(`../../messages/${locale}/${locale}_home.json`)).default;
  const resourceMessages = (await import(`../../messages/${locale}/${locale}_resource.json`)).default;
  const myLearningMessages = (await import(`../../messages/${locale}/${locale}_myLearning.json`)).default;

  return {
    ...headerMessages,
    ...homeMessages,
    ...resourceMessages,
    ...myLearningMessages
  };
}
