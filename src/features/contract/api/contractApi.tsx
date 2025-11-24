import { Contract, ContractQueryParams } from '@/features/contract/types/contract.type'
import { createCrudApi } from '@/libs/redux/baseApi'

export const contractApi = createCrudApi<Contract, ContractQueryParams>({
  reducerPath: 'contractApi',
  tagTypes: ['Contract'],
  baseUrl: '/contracts'
})

export const {
  // queries
  useSearchQuery: useSearchContractQuery,
  useGetAllQuery: useGetAllContractQuery,
  useGetByIdQuery: useGetContractByIdQuery,

  // mutations
  useCreateMutation: useCreateContractMutation,
  useUpdateMutation: useUpdateContractMutation,
  useDeleteMutation: useDeleteContractMutation,

  // lazy
  useLazySearchQuery: useLazySearchContractQuery,
  useLazyGetAllQuery: useLazyGetAllContractQuery,
  useLazyGetByIdQuery: useLazyGetContractByIdQuery
} = contractApi
