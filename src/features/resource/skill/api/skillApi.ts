import { Skill, SkillQueryParams } from '@/features/resource/skill/types/skill.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const skillApi = createCrudApi<Skill, SkillQueryParams>({
  reducerPath: 'skillApi',
  tagTypes: ['Skill'],
  baseUrl: '/skills'
})

export const {
  // queries
  useSearchQuery: useSearchSkillQuery,
  useGetAllQuery: useGetAllSkillQuery,
  useGetByIdQuery: useGetSkillByIdQuery,

  // mutations
  useCreateMutation: useCreateSkillMutation,
  useUpdateMutation: useUpdateSkillMutation,
  useDeleteMutation: useDeleteSkillMutation,

  // lazy
  useLazySearchQuery: useLazySearchSkillQuery,
  useLazyGetAllQuery: useLazyGetAllSkillQuery,
  useLazyGetByIdQuery: useLazyGetSkillByIdQuery
} = skillApi
