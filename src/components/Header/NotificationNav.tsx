import { HStack, Icon } from "@chakra-ui/react";
import { RiLogoutBoxLine, RiNotificationLine } from "react-icons/ri";

type NotificationNavProps = {
  signOut: () => void;
};

export function NotificationNav({ signOut }: NotificationNavProps) {
  return (
    <HStack
      spacing={["6", "8"]}
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Icon as={RiNotificationLine} color="blue.100" fontSize="20" />
      <Icon
        onClick={() => signOut()}
        as={RiLogoutBoxLine}
        fontSize="20"
        color="bg.gray.100"
        cursor="pointer"
        _hover={{
          bg: "gray.200",
        }}
      />
    </HStack>
  );
}
