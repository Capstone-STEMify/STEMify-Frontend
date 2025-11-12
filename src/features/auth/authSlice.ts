import { User } from '@/features/user/types/user.type'
import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  token: string | null
  user: User | null
}

const initialState: AuthState = {
  token: null,
  user: null
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
    logout: (state) => {
      state.token = null
      state.user = null
    }
  }
})

export const { setToken, logout, setUser } = authSlice.actions
