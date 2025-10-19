import { ContractSliceParams } from '@/features/contract/types/contract.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: ContractSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const contractSlice = createQuerySlice('contractSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  contractSlice.actions
