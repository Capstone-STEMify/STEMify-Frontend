'use client'

import { setToken, setUser } from '@/features/auth/authSlice'
import { useGetUserByIdQuery } from '@/features/user/api/userApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function AuthSessionSync() {
  const { data } = useSession()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)

  const { data: userData } = useGetUserByIdQuery(data?.user.userId!, { skip: !token })

  useEffect(() => {
    if (!data) return
    console.log('Session data changed:', data.user)
    dispatch(setToken(data.accessToken))
  }, [data, dispatch])
  useEffect(() => {
    if (!userData) return
    console.log('Fetched user data:', userData)
    dispatch(setUser(userData))
  }, [userData, dispatch])
  return null
}
