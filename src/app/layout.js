import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "@/redux/provider";
import config from "@/config";
import Footer from "@/components/footer";
import Header from "@/components/header";

import "./globals.css";
import MainLayout from "@/layouts/MainLayout";
import NotificationWatcher from "@/components/NotificationWatcher";

export const metadata = {
  title: {
    default: config.appName,
    template: `%s | ${config.appName}`,
  },
  description: "E-commerce website for all electronic items",
  keywords: "Online shopping in Nepal, Best electronic products online",
};

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        {/* Silence extension-related connection errors (MetaMask, etc.) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const originalError = console.error;
              const originalWarn = console.warn;
              
              const isExtensionNoise = (msg) => {
                if (typeof msg !== 'string') return false;
                const terms = ['MetaMask', 'extension', 'inpage', 'failed to connect', 'unauthorized', 'ejbalbakoplchlghecdal'];
                return terms.some(t => msg.toLowerCase().includes(t.toLowerCase()));
              };

              console.error = (...args) => {
                if (isExtensionNoise(args[0])) return;
                originalError.apply(console, args);
              };

              console.warn = (...args) => {
                if (isExtensionNoise(args[0])) return;
                originalWarn.apply(console, args);
              };

              // Catch unhandled promise rejections from extensions
              window.addEventListener('unhandledrejection', (event) => {
                const msg = event?.reason?.message || '';
                const stack = event?.reason?.stack || '';
                if (isExtensionNoise(msg) || isExtensionNoise(stack)) {
                  event.preventDefault(); // Silence the browser warning
                  event.stopPropagation();
                }
              });

              // Catch general runtime errors from injected scripts
              window.addEventListener('error', (event) => {
                const msg = event?.message || '';
                const filename = event?.filename || '';
                if (isExtensionNoise(msg) || isExtensionNoise(filename)) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }, true);
            `,
          }}
        />
        <AppProvider>
          <NotificationWatcher />
          <MainLayout>
            <Header />
            <main className="pt-16">
               {children}
               <ToastContainer 
                  position="bottom-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
            </main>
            <Footer />
          </MainLayout>
        </AppProvider>
      </body>
    </html>
  );
}

export default RootLayout;