import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import { Flex } from "@chakra-ui/react";

import { Header } from "../Header";
import { Sidebar } from "../Sidebar";

type LayoutProps = {
  children?: ReactNode;
};

const noWrap = ["/pedido/placas"];

export function Layout({ children }: LayoutProps) {
  const { asPath } = useRouter();

  const notShouldUseLayout = noWrap.some((route) => asPath.includes(route));

  if (notShouldUseLayout) {
    return <>{children}</>;
  }

  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        {children}
      </Flex>
    </Flex>
  );
}
