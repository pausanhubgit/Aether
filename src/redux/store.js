import { configureStore } from "@reduxjs/toolkit";

import persistReducer from "redux-persist/lib/persistReducer";
import rootReducer from "./rootReducer";
import persistStore from "redux-persist/lib/persistStore";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userPreferences", "auth", "cart", "notifications", "socialPersistence"],
};

const persistedReducer = typeof window !== "undefined" ? persistReducer(persistConfig, rootReducer) : rootReducer;

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = typeof window !== "undefined" ? persistStore(store) : null;

export { store, persistor };