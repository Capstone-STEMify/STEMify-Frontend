import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setToken, setUser } from '@/features/auth/authSlice'
import {
  setCurrentRole,
  setSelectedOrganizationId,
  setSelectedSubscriptionOrderId
} from '@/features/subscription/slice/selectedOrganizationSlice'
import { UserRole } from '@/types/userRole'

export default function AuthSessionSync() {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const reduxToken = useAppSelector((state) => state.auth.token)
  const reduxUser = useAppSelector((state) => state.auth.user)
  const reduxCurrentRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const reduxSelectedOrganizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)
  const reduxSelectedSubscriptionOrderId = useAppSelector(
    (state) => state.selectedOrganization.selectedSubscriptionOrderId
  )

  const user = session?.user
  const accessToken = session?.accessToken

  // Sync token vào Redux nếu khác hoặc chưa có
  useEffect(() => {
    if (accessToken && user) {
      if (accessToken !== reduxToken) {
        dispatch(setToken(accessToken))
      }

      if (!reduxUser || user.userId !== reduxUser.userId) {
        dispatch(setUser(user))
      }
    }
  }, [accessToken, user, reduxToken, reduxUser, dispatch])

  useEffect(() => {
    if (!reduxUser) return

    // Nếu là ADMIN hoặc STAFF thì không cần chọn subscription/org
    if (
      (reduxUser.userRole === UserRole.ADMIN || reduxUser.userRole === UserRole.STAFF) &&
      (!reduxCurrentRole || reduxCurrentRole !== reduxUser.userRole)
    ) {
      dispatch(setCurrentRole(reduxUser.userRole))
      return
    }

    // Nếu là MEMBER thì xử lý theo org/subscription
    console.log({ reduxSelectedOrganizationId, reduxSelectedSubscriptionOrderId, reduxCurrentRole })
    if (
      reduxUser.userRole === UserRole.MEMBER &&
      reduxUser.organizations &&
      reduxUser.organizations?.length > 0 &&
      reduxUser.organizations[0].subscriptions?.length > 0
      // (!reduxSelectedOrganizationId || !reduxSelectedSubscriptionOrderId || !reduxCurrentRole)
    ) {
      const firstOrg = reduxUser.organizations[0]
      const activeSub = firstOrg.subscriptions.find((s) => s.isActive)

      if (activeSub) {
        dispatch(setSelectedOrganizationId(firstOrg.id))
        dispatch(setSelectedSubscriptionOrderId(activeSub.id))
        dispatch(setCurrentRole(activeSub.role)) // Đây là LicenseType
        console.log('Default organization selected:', firstOrg, activeSub, activeSub.role)
      }
    }
  }, [reduxUser, reduxSelectedOrganizationId, reduxSelectedSubscriptionOrderId, reduxCurrentRole, dispatch])

  return null
}
