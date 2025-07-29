'use client'
import { User } from 'next-auth'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Enrollment } from '@/features/enrollment/types/enrollment.type'
import { useAppSelector } from '@/hooks/redux-hooks'

type Props = {
  children: ReactNode
}
export default function SignalRProvider({ children }: Props) {
  const connection = useRef<HubConnection | null>(null)

  const handleReceiveNotification = useCallback((notification: Notification) => {
    // Handle the enrollment created event
    // Update the bell notification count or show a toast
    console.log('Received notification:', notification)
  }, [])

  const accessToken = useAppSelector((state) => state.auth.token)
  useEffect(() => {
    if (!connection.current && accessToken) {
      connection.current = new HubConnectionBuilder()
        .withUrl('http://localhost:7004/api/notifications', {
          accessTokenFactory: () => accessToken || ''
        })
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
