import { Flex, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";

import { Logo } from "./Logo";
import { NotificationNav } from "./NotificationNav";
import { Profile } from "./Profile";

import { AuthContext } from "@/contexts/AuthContext";
import { useSidebarDrawer } from "@/contexts/SidebarDrawerContext";
import { useContext } from "react";

export function Header() {
  const { onOpen } = useSidebarDrawer();
  const { user, signOut } = useContext(AuthContext);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open Navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={() => onOpen()}
          mr="2"
        />
      )}

      <Logo />

      {/*
        {isWideVersion && <SearchBox />}

        <Flex align="center" ml="auto">
          <NotificationNav />
          <Profile showProfileData={isWideVersion} />
        </Flex>
      */}

      <Flex align="center" ml="auto">
        <NotificationNav signOut={signOut} />
        <Profile
          showProfileData={isWideVersion}
          name={user?.name}
          email={user?.email}
        />
      </Flex>
    </Flex>
  );
}
