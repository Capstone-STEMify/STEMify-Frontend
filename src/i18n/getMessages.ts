import { cache } from 'react'
import { loadMessages } from './loadMessages'

export const getMessages = cache(async (locale: string) => {
  return loadMessages(locale)
})
