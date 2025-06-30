import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Skill = {
  id: number
  skillName: string
  iconUrl: string
  description: number
}

export type SkillQueryParams = {
  // nothing here for now, but can be extended in the future
} & SearchPaginatedRequestParams

export type SkillSliceParams = {
  // nothing here for now, but can be extended in the future
} & SliceQueryParams
