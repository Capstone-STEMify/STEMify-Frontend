import { Assignment, RubricCriterion } from '@/features/assignment/types/assignment.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export const assignmentApi = createCrudApi<Assignment, SearchPaginatedRequestParams>({
  reducerPath: 'assignmentApi',
  tagTypes: ['Assignment'],
  baseUrl: '/assignments'
}).injectEndpoints({
  endpoints: (builder) => ({
    searchRubricCriteria: builder.query<RubricCriterion[], SearchPaginatedRequestParams>({
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
    })
  })
})

export const {
  useGetByIdQuery: useGetAssignmentByIdQuery,
  useCreateMutation: useCreateAssignmentMutation,
  useUpdateMutation: useUpdateAssignmentMutation,
  useDeleteMutation: useDeleteAssignmentMutation
} = assignmentApi
