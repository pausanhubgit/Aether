'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from '@/lib/store';
import { AuthProvider } from '@/lib/authContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId="600858873492-kk4qumr4p233qlc5khomab4531lcq613.apps.googleusercontent.com">
      <Provider store={store}>
      <AuthProvider>
        <PersistGate loading={null} persistor={persistor}>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </PersistGate>
      </AuthProvider>
    </Provider>
  </GoogleOAuthProvider>
  );
}