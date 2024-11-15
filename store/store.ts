import CryptoJS from "crypto-js";

import { combineReducers } from "redux";
import { createTransform } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const encryptTransform = createTransform(
  (inboundState) => {
    const encrypted =
      CryptoJS.AES.encrypt(JSON.stringify(inboundState), process.env.NEXT_PUBLIC_AES_SECRET_KEY!).toString();
    return encrypted;
  },
  (outboundState) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, process.env.NEXT_PUBLIC_AES_SECRET_KEY!);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  },
  { whitelist: ["auth", "booking"] }
);

const createNoopStorage = () => {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve()
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

import authReducer from "./slices/auth-slice";
import commonReducer from "./slices/common-slice";
import bookingReducer from "./slices/booking-slice";
import settingsReducer from "./slices/settings-slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "booking"],
  transforms: [encryptTransform]
};

const rootReducer: any = combineReducers({
  auth: authReducer,
  common: commonReducer,
  booking: bookingReducer,
  settings: settingsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
      }
    })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;