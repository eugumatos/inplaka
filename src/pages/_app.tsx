import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import { SidebarDrawerProvider } from "@/contexts/SidebarDrawerContext";
import { theme } from "@/styles/theme";
import { Layout } from "@/components/Layout";

import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SidebarDrawerProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </SidebarDrawerProvider>
    </ChakraProvider>
  );
}
