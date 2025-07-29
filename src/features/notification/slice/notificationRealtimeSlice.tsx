import { Notification } from '@/features/notification/types/notification.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NotificationRealtimeState {
  items: Notification[]
}

const initialState: NotificationRealtimeState = {
  items: []
}

export const notificationRealtimeSlice = createSlice({
  name: 'notificationRealtime',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload)
    },
    markAsRead(state, action: PayloadAction<number>) {
      const item = state.items.find((n) => n.id === action.payload)
      if (item) item.isRead = true
    },
    clearNotifications(state) {
      state.items = []
    }
}
})

export const { addNotification, markAsRead, clearNotifications } = notificationRealtimeSlice.actions
