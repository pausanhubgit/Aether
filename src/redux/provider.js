"use client";

import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "@/lib/authContext";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const AppProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <GoogleOAuthProvider clientId="600858873492-kk4qumr4p233qlc5khomab4531lcq613.apps.googleusercontent.com">
      <Provider store={store}>
        <AuthProvider>
          {mounted && persistor ? (
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          ) : (
            children
          )}
        </AuthProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default AppProvider;
