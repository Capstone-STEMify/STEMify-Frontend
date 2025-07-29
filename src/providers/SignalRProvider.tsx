'use client'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { addNotification } from '@/features/notification/slice/notificationRealtimeSlice'
import { Notification } from '@/features/notification/types/notification.type'
import { notificationApi } from '@/features/notification/api/notificationApi'

type Props = {
  children: ReactNode
}
export default function SignalRProvider({ children }: Props) {
  const dispatch = useAppDispatch()
  const connection = useRef<HubConnection | null>(null)

  const handleReceiveNotification = useCallback(
    (notification: Notification) => {
      dispatch(notificationApi.util.invalidateTags(['Notification']))
      console.log('handleReceiveNotification')
    },
    [dispatch]
  )

  const accessToken = useAppSelector((state) => state.auth.token)
  useEffect(() => {
    if (!connection.current && accessToken) {
      connection.current = new HubConnectionBuilder()
        .withUrl('http://localhost:7004/api/notifications', {
          accessTokenFactory: () => accessToken || ''
        })
        // .configureLogging('none')
        .withAutomaticReconnect()
        .build()

      connection.current
        .start()
        .then(() => {
          console.log('Connected to notification hub')
        })
        .catch((err) => console.log(err))

      connection.current.on('ReceiveNotification', handleReceiveNotification)

      return () => {
        connection.current?.off('ReceiveNotification', handleReceiveNotification)
      }
    }
  }, [handleReceiveNotification, accessToken])
  return children
}
