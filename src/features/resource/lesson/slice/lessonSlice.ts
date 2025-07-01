import { LessonSliceParams } from '@/features/resource/lesson/types/lesson.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: LessonSliceParams = {
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
