import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
  name?: string;
  email?: string;
}

export function Profile({
  showProfileData = true,
  name = "",
  email = "",
}: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{name}</Text>
          <Text color="gray.300" fontSize="small">
            {email}
          </Text>
        </Box>
      )}
      <Avatar bg="gray.400" name="J" src="https://bit.ly/tioluwani-kolawole" />
    </Flex>
  );
}
