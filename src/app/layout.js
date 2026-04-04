import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppProvider from "@/redux/provider";
import config from "@/config";
import Footer from "@/components/footer";
import Header from "@/components/header";

import "./globals.css";
import MainLayout from "@/layouts/MainLayout";

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
      <body>
        <AppProvider>
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