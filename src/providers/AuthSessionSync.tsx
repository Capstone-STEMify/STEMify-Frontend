import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setToken, setUser } from '@/features/auth/authSlice'
import { useGetUserByIdQuery } from '@/features/user/api/userApi'

export default function AuthSessionSync() {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const reduxToken = useAppSelector((state) => state.auth.token)
  const reduxUser = useAppSelector((state) => state.auth.user)

  const userId = session?.user.userId
  const accessToken = session?.accessToken

  // Chỉ fetch nếu: có userId && reduxToken && Redux chưa có user
  const shouldFetchUser = !!userId && !!reduxToken && !reduxUser

  const { data: userData } = useGetUserByIdQuery(userId!, {
    skip: !shouldFetchUser
  })

  // Sync token vào Redux nếu khác hoặc chưa có
  useEffect(() => {
    if (accessToken && accessToken !== reduxToken) {
      dispatch(setToken(accessToken))
    }
  }, [accessToken, reduxToken, dispatch])

  // Sync user vào Redux
  useEffect(() => {
    if (userData && !reduxUser) {
      dispatch(setUser(userData.data))
      //TODO: Remove log later
      console.log('User data synced to Redux:', userData.data)
    }
  }, [userData, reduxUser, dispatch])

  return null
}
