import { courseApi } from '@/features/resource/course/api/courseApi'
import { Export } from '@/features/resource/export/types/export.type'
import { ApiSuccessResponse } from '@/types/baseModel'

export const exportApi = courseApi.injectEndpoints({
  endpoints: (builder) => ({
    exportToRSA: builder.query<ApiSuccessResponse<Export>, { courseId: number }>({
      query: ({ courseId }) => ({
        url: `/courses/${courseId}/export`,
        method: 'GET'
      })
    })
  })
})

export const { useLazyExportToRSAQuery } = exportApi
