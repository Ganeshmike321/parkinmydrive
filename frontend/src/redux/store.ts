// import { combineReducers, configureStore } from '@reduxjs/toolkit'
// import storage from 'redux-persist/lib/storage'

// import transferReducer from './dataTransfer'
// import SearchReducer from './searchSlice'
// import UserReducer from './userSlice'
// import { persistReducer } from 'redux-persist';

// const reducers = combineReducers({
//     data: transferReducer,
//     search: SearchReducer,
//     user: UserReducer
// });

// const persistConfig = {
//     key: 'root',
//     storage
// };

// const persistedReducer = persistReducer(persistConfig, reducers);

// export const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 // Ignore these action types
//                 ignoredActions: ['search/searchSubmit']
//             },
//         }),
// })

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import type { PersistConfig } from 'redux-persist';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

// Reducers
import transferReducer from './dataTransfer';
import SearchReducer from './searchSlice';
import UserReducer from './userSlice';

// Combine all reducers
const reducers = combineReducers({
  data: transferReducer,
  search: SearchReducer,
  user: UserReducer
});

// Persist config typed with `PersistConfig`
const persistConfig: PersistConfig<ReturnType<typeof reducers>> = {
  key: 'root',
  storage
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// ✅ Types for later use in hooks and selectors
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
