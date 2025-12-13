import { createQuerySlice } from '@/libs/redux/createQuerySlice'
import { CurriculumSliceParams, CurriculumStatus } from '../types/curriculum.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrganizationCurriculum } from '@/features/organization/types/organization.type'

const initialState: CurriculumSliceParams = {
  pageNumber: 1,
  pageSize: 5,
  search: '',
  orderBy: '',
  curriculumId: undefined
}

export const curriculumSlice = createQuerySlice('curriculumSlice', initialState)

export const { setPageIndex, setPageSize, setSearchTerm, setParam, setMultipleParams, resetParams } =
  curriculumSlice.actions

interface SelectedCurriculumState {
  selectedCurriculum: OrganizationCurriculum | null
}

const selectedCurriculumInitialState: SelectedCurriculumState = {
  selectedCurriculum: null
}
// Organization selected curriculum slice
export const selectedCurriculumSlice = createSlice({
  name: 'selectedCurriculum',
  initialState: selectedCurriculumInitialState,
  reducers: {
    setSelectedCurriculum: (state, action: PayloadAction<OrganizationCurriculum | null>) => {
      state.selectedCurriculum = action.payload
    },
    clearSelectedCurriculum: (state) => {
      state.selectedCurriculum = null
    }
  }
})

export const { setSelectedCurriculum, clearSelectedCurriculum } = selectedCurriculumSlice.actions
