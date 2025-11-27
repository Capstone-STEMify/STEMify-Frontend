import {
  Assignment,
  AssignmentQueryParams,
  RubricCriterion,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentImportResponse
} from '@/features/assignment/types/assignment.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { ApiSuccessResponse } from '@/types/baseModel'
import { get } from 'http'

export const assignmentApi = createCrudApi<Assignment, AssignmentQueryParams>({
  reducerPath: 'assignmentApi',
  tagTypes: ['Assignment'],
  baseUrl: '/assignments'
}).injectEndpoints({
  endpoints: (builder) => ({
    createAssignment: builder.mutation<ApiSuccessResponse<Assignment>, CreateAssignmentDto>({
      query: (body) => ({
        url: '/assignments',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Assignment']
    }),

    // Override update mutation with proper DTO type
    updateAssignment: builder.mutation<ApiSuccessResponse<Assignment>, { id: number; body: UpdateAssignmentDto }>({
      query: ({ id, body }) => ({
        url: `/assignments/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Assignment', id }, { type: 'Assignment' }]
    }),

    // Rubric Criterion endpoints
    searchRubricCriteria: builder.query<RubricCriterion[], AssignmentQueryParams>({
      query: (params) => ({
        url: '/rubric-criterions',
        params
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Assignment' as const, id })), { type: 'Assignment', id: 'LIST' }]
          : [{ type: 'Assignment', id: 'LIST' }]
    }),

    getRubricCriterionById: builder.query<RubricCriterion, number>({
      query: (id) => `rubric-criterions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assignment', id }]
    }),

    createRubricCriterion: builder.mutation<RubricCriterion, Partial<RubricCriterion>>({
      query: (body) => ({
        url: '/rubric-criterions',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Assignment' }]
    }),

    updateRubricCriterion: builder.mutation<RubricCriterion, { id: number; body: Partial<RubricCriterion> }>({
      query: ({ id, body }) => ({
        url: `/rubric-criterions/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Assignment', id }]
    }),

    deleteRubricCriterion: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/rubric-criterions/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Assignment', id }]
    }),

    // CSV
    getAssignmentCSV: builder.query<
      ApiSuccessResponse<{
        csvFile: string
        fileName: string
      }>,
      void
    >({
      query: () => ({ url: `/assignments/template` })
    }),

    importAssignmentCSV: builder.mutation<
      ApiSuccessResponse<AssignmentImportResponse>,
      { csvFile: string; assignmentId: number }
    >({
      query: ({ csvFile, assignmentId }) => {
        return {
          url: `/assignments/${assignmentId}/import`,
          method: 'POST',
          body: { csvFile }
        }
      },
      invalidatesTags: [{ type: 'Assignment' }]
    })
  })
})

export const {
  // Assignment CRUD
  useGetByIdQuery: useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteMutation: useDeleteAssignmentMutation,

  // Rubric Criterion
  useSearchRubricCriteriaQuery,
  useGetRubricCriterionByIdQuery,
  useCreateRubricCriterionMutation,
  useUpdateRubricCriterionMutation,
  useDeleteRubricCriterionMutation,

  // CSV
  useGetAssignmentCSVQuery,
  useImportAssignmentCSVMutation
} = assignmentApi
