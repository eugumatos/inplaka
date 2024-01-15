import { Flex, Box, Text, Avatar } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Jonh Doe</Text>
          <Text color="gray.300" fontSize="small">
            jonh@outlook.com
          </Text>
        </Box>
      )}
      <Avatar bg="gray.400" name="J" src="https://bit.ly/tioluwani-kolawole" />
    </Flex>
  );
}
