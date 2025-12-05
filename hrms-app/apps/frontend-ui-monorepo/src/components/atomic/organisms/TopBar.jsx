import { Flex, VStack, Heading, Text, Box } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "@/components/atomic/molecules/LogoutButton";

const TopBar = () => {
  const { user } = useAuth0();

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8 }}
      py={4}
      borderBottomWidth="1px"
      borderColor="gray.100"
      bg="white"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <VStack align="start" spacing={0}>
        <Heading size="md">Hello {user?.name || user?.email}</Heading>
        <Text fontSize="sm" color="gray.500">
          Good Morning
        </Text>
      </VStack>

      <Box>
        {/* later: replace with full UserProfileMenu molecule */}
        <LogoutButton />
      </Box>
    </Flex>
  );
};

export default TopBar;
