import { Layout } from "@/components/Layout";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";
import { theme } from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "@/contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "../styles/date-picker.css";

export default function App({ Component, pageProps, router }: AppProps) {
  const isLoginPage = router.pathname === "/login";

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <SidebarDrawerProvider>
          {isLoginPage ? (
            <>
              <Component {...pageProps} />
            </>
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
          <ToastContainer />
        </SidebarDrawerProvider>
      </ChakraProvider>
    </AuthProvider>
  );
}
