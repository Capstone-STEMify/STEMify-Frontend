import { LessonAssetSliceParams, LessonAssetType } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: LessonAssetSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  type: LessonAssetType.IMAGE,
  tagId: undefined,
  search: ''
}

export const lessonAssetSlice = createQuerySlice('lessonAssetSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  lessonAssetSlice.actions
