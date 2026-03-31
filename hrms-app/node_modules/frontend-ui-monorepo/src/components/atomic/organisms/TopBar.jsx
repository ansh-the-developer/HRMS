import { Flex, VStack, Heading, Text, Box } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth"; // ✅ replaces useAuth0
import { LogoutButton } from "@/components/atomic/molecules/LogoutButton";
import SidebarToggleButton from "@/components/atomic/atoms/SidebarToggleButton";
import UserProfileMenu from "../organisms/UserProfileMenu";

const TopBar = ({ onOpenSidebarMobile }) => {
  const { user } = useAuth(); // ✅ replaces useAuth0()

  // ✅ Supabase user display name fallback chain
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";

  return (
    <Flex
      as="header"
      align="center"
      px={{ base: 4, md: 8 }}
      py={4}
      borderBottomWidth="1px"
      borderColor="gray.100"
      bg="white"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex align="center" gap={3} minW={0}>
        <SidebarToggleButton onClick={onOpenSidebarMobile} />

        <VStack align="start" spacing={0} minW={0}>
          <Heading size="md" noOfLines={1}>
            Hello, {displayName} 👋
          </Heading>
          <Text fontSize="sm" color="gray.500">
            Good Morning
          </Text>
        </VStack>
      </Flex>

      {/* Right side of TopBar */}
      <Flex ml="auto" align="center" gap={3} flexShrink={0}>
        {/* Mobile: simple avatar icon */}
        <Box display={{ base: "block", md: "none" }}>
          <UserProfileMenu role="HR Executive" variant="icon" />
        </Box>

        {/* Desktop: full pill */}
        <Box display={{ base: "none", md: "block" }}>
          <UserProfileMenu role="HR Executive" variant="pill" />
        </Box>
      </Flex>
    </Flex>
  );
};

export default TopBar;