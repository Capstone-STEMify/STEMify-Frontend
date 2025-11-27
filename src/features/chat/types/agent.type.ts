export type LessonSectionAIResponse = {
  provider: string
  model: string
  section: {
    title: string
    durationMinutes: number
    description: string
    raw_answer: string
  }
  is_fallback_data: boolean
}
