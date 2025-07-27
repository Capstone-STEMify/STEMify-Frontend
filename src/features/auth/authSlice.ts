import { createSlice } from '@reduxjs/toolkit'
import { User } from 'next-auth'

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
    clearToken: (state) => {
      state.token = null
    }
  }
})

export const { setToken, clearToken, setUser } = authSlice.actions
