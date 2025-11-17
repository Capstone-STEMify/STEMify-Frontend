import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setToken, setUser } from '@/features/auth/authSlice'
import { useGetUserByIdQuery } from '@/features/user/api/userApi'
import { setSelectedOrganizationId } from '@/features/subscription/slice/selectedOrganizationSlice'

export default function AuthSessionSync() {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const reduxToken = useAppSelector((state) => state.auth.token)
  const reduxUser = useAppSelector((state) => state.auth.user)

  const user = session?.user
  const accessToken = session?.accessToken

  // Sync token vào Redux nếu khác hoặc chưa có
  useEffect(() => {
    if (accessToken && accessToken !== reduxToken) {
      dispatch(setToken(accessToken))
    }
  }, [accessToken, reduxToken, dispatch])

  useEffect(() => {
    if (user) {
      dispatch(setUser(user))
      console.log('User data synced to Redux:', user)
    }
  }, [user, dispatch])

  return null
}
