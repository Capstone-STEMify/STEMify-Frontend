import { BaseQueryParams, createQuerySlice } from '@/libs/redux/createQuerySlice'

type LessonQueryParams = {
  courseId?: number
  createdByUserId?: string
} & BaseQueryParams

const initialState: LessonQueryParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const lessonSlice = createQuerySlice('lessonSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  lessonSlice.actions

// guide for using filter query slice actions
// dispatch(setParam({ key: 'courseId', value: 1 }))
// dispatch(setMultipleParams({ courseId: 1, createdByUserId: 'user-id' }))
