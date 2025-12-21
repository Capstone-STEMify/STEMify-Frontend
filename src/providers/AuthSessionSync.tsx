import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setExpiredOrganizationUserIds, setExpiredRoles, setToken, setUser } from '@/features/auth/authSlice'
import {
  setCurrentRole,
  setSelectedOrganizationId,
  setSelectedOrgUserId,
  setSelectedSubscriptionOrderId
} from '@/features/subscription/slice/selectedOrganizationSlice'
import { UserRole } from '@/types/userRole'

export default function AuthSessionSync() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()

  const reduxToken = useAppSelector((state) => state.auth.token)
  const reduxUser = useAppSelector((state) => state.auth.user)
  const reduxCurrentRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const reduxSelectedOrganizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)
  const reduxSelectedSubscriptionOrderId = useAppSelector(
    (state) => state.selectedOrganization.selectedSubscriptionOrderId
  )

  console.log('reduxCurrentRole:', reduxCurrentRole)

  const user = session?.user
  const accessToken = session?.accessToken

  // Sync token vào Redux nếu khác hoặc chưa có
  useEffect(() => {
    if (status !== 'authenticated' || !reduxUser) return
    // logic sync
  }, [status, reduxUser])

  useEffect(() => {
    if (accessToken && user) {
      if (accessToken !== reduxToken) {
        dispatch(setToken(accessToken))
        localStorage.setItem('stemify_user_id', user.userId!)
        localStorage.setItem('stemify_access_token', accessToken)
      }

      if (!reduxUser || user.userId !== reduxUser.userId) {
        dispatch(setUser(user))
      }
    }
  }, [accessToken, user, reduxToken, reduxUser, dispatch])

  useEffect(() => {
    if (!reduxUser) return

    /* =========================
     * ADMIN / STAFF
     * ========================= */
    if (
      (reduxUser.userRole === UserRole.ADMIN || reduxUser.userRole === UserRole.STAFF) &&
      reduxCurrentRole !== reduxUser.userRole
    ) {
      dispatch(setCurrentRole(reduxUser.userRole))
      return
    }

    /* =========================
     * MEMBER
     * ========================= */
    if (
      reduxUser.userRole === UserRole.MEMBER &&
      reduxUser.organizations &&
      reduxUser.organizations.organizations?.length > 0
    ) {
      const firstOrg = reduxUser.organizations.organizations[0]

      const hasActiveRole = firstOrg.roles && firstOrg.roles.length > 0
      const hasExpiredRole = firstOrg.expiredRoles && firstOrg.expiredRoles.length > 0

      /* ===== ACTIVE ORG ===== */
      if (hasActiveRole && (!reduxSelectedOrganizationId || !reduxCurrentRole)) {
        const activeSub = firstOrg.roles[0]

        dispatch(setSelectedOrganizationId(firstOrg.id))
        dispatch(setSelectedSubscriptionOrderId(activeSub.subscriptionId))
        dispatch(setSelectedOrgUserId(firstOrg.organizationUserId[0]))
        dispatch(setCurrentRole(activeSub.type)) // LicenseType

        console.log('[ACTIVE]', {
          orgId: firstOrg.id,
          role: activeSub.type
        })
      }

      /* ===== EXPIRED INFO ===== */
      if (hasExpiredRole) {
        dispatch(setExpiredRoles(firstOrg.expiredRoles))
        dispatch(setExpiredOrganizationUserIds(firstOrg.expiredOrganizationUserIds))

        console.log('[EXPIRED]', {
          roles: firstOrg.expiredRoles,
          orgUserIds: firstOrg.expiredOrganizationUserIds
        })
      }
    }
  }, [reduxUser, reduxSelectedOrganizationId, reduxCurrentRole, dispatch])

  return null
}
