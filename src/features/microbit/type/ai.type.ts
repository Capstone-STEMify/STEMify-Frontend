export interface MicrobitEvaluateResponse {
  analysis: string
  suggestions: string | null
  learning_points: string | null
  answer: string | null
  provider: string
  model: string
}

export type MicrobitEvaluateRequest = {
  project_files: Record<string, string> 
  question: string | null
  language: string
  analysis_type: 'comprehensive' | 'specific_question'
}