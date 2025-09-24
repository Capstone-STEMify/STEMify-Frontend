import {
  LessonAsset,
  LessonAssetSliceParams,
  PostLessonAssetRequestBody
} from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const lessonAssetApi = lessonApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getListLessonAssets: builder.query<
      ApiSuccessResponse<PaginatedResult<LessonAsset>>,
      { lessonId: number; params: LessonAssetSliceParams }
    >({
      query: ({ lessonId, params }) => ({
        url: `/lessons/${lessonId}/lesson-assets`,
        method: 'GET',
        params
      }),
      providesTags: (result, error, { lessonId }) => [{ type: 'LessonAsset' as const, id: lessonId }]
    }),
    getLessonAssetById: builder.query<ApiSuccessResponse<LessonAsset>, { lessonId: number; assetId: number }>({
      query: ({ lessonId, assetId }) => ({
        url: `/lessons/${lessonId}/lesson-assets/${assetId}`,
        method: 'GET'
      }),
      providesTags: (result, error, { assetId }) => [{ type: 'LessonAsset' as const, id: assetId }]
    }),
    // POST
    postLessonAssets: builder.mutation<
      ApiSuccessResponse<void>,
      { lessonId: number; body: PostLessonAssetRequestBody }
    >({
      query: ({ lessonId, body }) => ({
        url: `/lessons/${lessonId}/lesson-assets`,
        method: 'POST',
        body
      })
    }),
    // DELETE
    deleteListLessonAssets: builder.mutation<ApiSuccessResponse<void>, { lessonId: number; ids: number[] }>({
      query: ({ lessonId, ids }) => ({
        url: `/lessons/${lessonId}/lesson-assets`,
        method: 'DELETE',
        body: { ids }
      })
    })
  })
})

export const {
  useGetListLessonAssetsQuery,
  useGetLessonAssetByIdQuery,
  usePostLessonAssetsMutation,
  useDeleteListLessonAssetsMutation
} = lessonAssetApi
