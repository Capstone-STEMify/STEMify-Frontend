import { apiMiddlewares } from '@/libs/redux/apiMiddleware'
import { rootReducer } from '@/libs/redux/rootReducer'
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'quizSelected',
    'selectedOrganization',
    'auth',
    'enrollment',
    'organizationSpecial',
    'selectedCurriculum',
    'quizPlayer',
    'lessonDetail'
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
        }
      }).concat(apiMiddlewares)
  })
}

export const store = makeStore()
export const persistor = persistStore(store)

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
