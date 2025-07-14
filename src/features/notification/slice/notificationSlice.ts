import { NotificationSliceParams } from '@/features/notification/types/notification.type'
import { createQuerySlice } from '@/libs/redux/createQuerySlice'

const initialState: NotificationSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  status: ''
}

export const notificationSlice = createQuerySlice('notificationSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  notificationSlice.actions
