import { createQuerySlice } from '@/libs/redux/createQuerySlice'
import { Curriculum, CurriculumSliceParams, CurriculumStatus } from '../types/curriculum.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
  selectedCurriculum: Curriculum | null
}

const selectedCurriculumInitialState: SelectedCurriculumState = {
  selectedCurriculum: null
}

export const selectedCurriculumSlice = createSlice({
  name: 'selectedCurriculum',
  initialState: selectedCurriculumInitialState,
  reducers: {
    setSelectedCurriculum: (state, action: PayloadAction<Curriculum | null>) => {
      state.selectedCurriculum = action.payload
    },
    clearSelectedCurriculum: (state) => {
      state.selectedCurriculum = null
    }
  }
})

export const { setSelectedCurriculum, clearSelectedCurriculum } = selectedCurriculumSlice.actions
