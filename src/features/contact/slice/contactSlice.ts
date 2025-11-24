import { ContactSliceParams } from '@/features/contact/types/contact.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: ContactSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const contactSlice = createQuerySlice('contactSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  contactSlice.actions
