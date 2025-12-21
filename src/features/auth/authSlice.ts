import { User } from '@/features/user/types/user.type'
import { LicenseType } from '@/types/userRole'
import { createSlice } from '@reduxjs/toolkit'
import { set } from 'zod'

export interface AuthState {
  token: string | null
  user: User | null
  expiredRoles: LicenseType[]
  expiredOrganizationUserIds: string[]
}

const initialState: AuthState = {
  token: null,
  user: null,
  expiredRoles: [],
  expiredOrganizationUserIds: []
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setUser(state, action) {
      state.user = action.payload
    },
    setExpiredRoles(state, action) {
      state.expiredRoles = action.payload
    },
    setExpiredOrganizationUserIds(state, action) {
      state.expiredOrganizationUserIds = action.payload
    },
    logout: (state) => {
      state.token = null
      state.user = null
    }
  }
})

export const { setToken, logout, setUser, setExpiredRoles, setExpiredOrganizationUserIds } = authSlice.actions
