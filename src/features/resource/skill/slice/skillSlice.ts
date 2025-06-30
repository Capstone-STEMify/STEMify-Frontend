import { SkillSliceParams } from '@/features/resource/skill/types/skill.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: SkillSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const skillSlice = createQuerySlice('skillSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } = skillSlice.actions

// guide for using filter query slice actions
// dispatch(setParam({ key: 'courseId', value: 1 }))
// dispatch(setMultipleParams({ courseId: 1, createdByUserId: 'user-id' }))
