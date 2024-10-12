// store.ts
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import authReducer from "./slices/auth-slice";
import storage from "redux-persist/lib/storage";
import commonReducer from "./slices/common-slice";
import specialtyReducer from "./slices/specialty-slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"]
};

const rootReducer = combineReducers({
  auth: authReducer,
  common: commonReducer,
  specialty: specialtyReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;