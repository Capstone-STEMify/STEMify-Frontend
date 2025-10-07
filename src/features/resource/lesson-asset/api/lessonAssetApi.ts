import {
  LessonAsset,
  LessonAssetListResponse,
  LessonAssetSliceParams,
  LessonAssetTag,
  PostLessonAssetRequestBody,
  PostLessonResponseBody
} from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { lessonApi } from '@/features/resource/lesson/api/lessonApi'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

export const lessonAssetApi = lessonApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET
    getListLessonAssets: builder.query<
      ApiSuccessResponse<PaginatedResult<LessonAssetListResponse>>,
      { lessonId: number; params: LessonAssetSliceParams }
    >({
      query: ({ lessonId, params }) => ({
        url: `/lessons/${lessonId}/lesson-assets`,
        method: 'GET',
        params
      }),
      providesTags: () => [{ type: 'LessonAsset' as const, id: 'LIST' }]
    }),
    getLessonAssetById: builder.query<ApiSuccessResponse<LessonAsset>, { lessonId: number; assetId: number }>({
      query: ({ lessonId, assetId }) => ({
        url: `/lessons/${lessonId}/lesson-assets/${assetId}`,
        method: 'GET'
      }),
      providesTags: () => [{ type: 'LessonAsset', id: 'LIST' }]
    }),
    // POST
    postLessonAssets: builder.mutation<
      ApiSuccessResponse<{ assets: PostLessonResponseBody[] }>,
      { lessonId: number; body: PostLessonAssetRequestBody }
    >({
      query: ({ lessonId, body }) => ({
        url: `/lessons/${lessonId}/lesson-assets`,
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'LessonAsset', id: 'LIST' }]
    }),
    // DELETE
    deleteListLessonAssets: builder.mutation<ApiSuccessResponse<void>, { lessonId: number; ids: number[] }>({
      query: ({ lessonId, ids }) => ({
        url: `/lessons/${lessonId}/lesson-assets`,
        method: 'DELETE',
        body: { ids }
      }),
      invalidatesTags: [{ type: 'LessonAsset', id: 'LIST' }]
    }),

    // =================================================
    // TAGS
    // =================================================
    getLessonAssetTagList: builder.query<
      ApiSuccessResponse<PaginatedResult<LessonAssetTag>>,
      { params: { search: string; pageNumber: number; pageSize: number } }
    >({
      query: ({ params }) => ({
        url: `/tags`,
        method: 'GET',
        params
      }),
      providesTags: () => [{ type: 'LessonAssetTag', id: 'LIST' }]
    }),

    // POST
    createLessonAssetTag: builder.mutation<void, { lessonId: number; assetId: number; body: Partial<LessonAssetTag> }>({
      query: ({ lessonId, assetId, body }) => ({
        url: `/lessons/${lessonId}/lesson-assets/${assetId}/tags`,
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'LessonAssetTag', id: 'LIST' }]
    }),

    // DELETE
    deleteLessonAssetTag: builder.mutation<void, { lessonId: number; assetId: number; tagId: number }>({
      query: ({ lessonId, assetId, tagId }) => ({
        url: `/lessons/${lessonId}/lesson-assets/${assetId}/tags/${tagId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'LessonAssetTag', id: 'LIST' }]
    })
  })
})

export const {
  useGetListLessonAssetsQuery,
  useGetLessonAssetByIdQuery,
  usePostLessonAssetsMutation,
  useDeleteListLessonAssetsMutation,

  useGetLessonAssetTagListQuery,
  useCreateLessonAssetTagMutation,
  useDeleteLessonAssetTagMutation
} = lessonAssetApi
