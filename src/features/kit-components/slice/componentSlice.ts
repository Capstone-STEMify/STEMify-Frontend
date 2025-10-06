import { ComponentSliceParams } from '@/features/kit-components/types/kit-component.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: ComponentSliceParams = {
  pageNumber: 1,
  pageSize: 10,
  search: ''
}

export const componentSlice = createQuerySlice('componentSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  componentSlice.actions
