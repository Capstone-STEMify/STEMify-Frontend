export type Emulator = {
  emulatorId: string
  success: boolean
  name: string
  slug: string
  version: string
  status: string
  message: string
  definitionJson: any
}

export type EmulatorCreateRequest = {
  name: string
  description: string
  visibility: string
  definition_json: any
}
