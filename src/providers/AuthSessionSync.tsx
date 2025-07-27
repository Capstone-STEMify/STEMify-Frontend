'use client'

import { setToken, setUser } from '@/features/auth/authSlice'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function AuthSessionSync() {
  const { data } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!data) return

    dispatch(setUser(data.user))
    dispatch(setToken(data.accessToken))
  }, [data, dispatch])
  return null
}
