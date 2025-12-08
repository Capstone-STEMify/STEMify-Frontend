export type EmulatorSearchParams = {
  page?: number
  limit?: number
  search?: string
  difficulty?: string
  userId?: string
  status?: EmulatorStatus
}

export type Emulator = {
  emulationId: string
  success: boolean
  name: string
  slug: string
  visibility: 'public' | 'private'
  description: string
  version: string
  status: EmulatorStatus
  message: string
  definitionJson: string
}

export type EmulatorWithThumbnail = Emulator & {
  thumbnailUrl: string
}

export type EmulatorResponse = {
  success: boolean
  items: EmulatorWithThumbnail[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export type EmulatorCreateRequest = {
  name: string
  description: string
  visibility: string
  definition_json: any
  thumbnail_image_base64?: string
  thumbnail_file_name?: string
  userId: string
}

// draft, review, published, archived

export type EmulatorUpdateRequest = {
  name: string
  description: string
  visibility: string
  definition_json: any
  status: EmulatorStatus
}

export enum EmulatorStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}
