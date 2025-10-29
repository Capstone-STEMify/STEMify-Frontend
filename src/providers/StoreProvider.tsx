'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store, AppStore, persistor } from '@/libs/redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Use the same store instance that was used to create the persistor so
  // redux-persist can rehydrate the state correctly on reloads.
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = store
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
