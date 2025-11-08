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
    dispatch(setUser(data.user))
    dispatch(setToken(data.accessToken))
  }, [data, dispatch])
  return null
}
