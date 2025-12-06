// src/components/atomic/organisms/TopBar.jsx
import { Flex, VStack, Heading, Text, Box } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "@/components/atomic/molecules/LogoutButton";
import SidebarToggleButton from "@/components/atomic/atoms/SidebarToggleButton";
import { IconButton } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import UserProfileMenu from "../organisms/UserProfileMenu";

const TopBar = ({ onOpenSidebarMobile }) => {
  const { user } = useAuth0();

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
        Hello {user?.name || user?.email}
      </Heading>
      <Text fontSize="sm" color="gray.500">
        Good Morning
      </Text>
    </VStack>
  </Flex>

  {/* Right side of TopBar */}
  <Flex ml="auto" align="center" gap={3} flexShrink={0}>
    {/* mobile: simple avatar icon */}
    <Box display={{ base: "block", md: "none" }}>
      <UserProfileMenu role="HR Executive" variant="icon" />
    </Box>

    {/* desktop: full pill */}
    <Box display={{ base: "none", md: "block" }}>
      <UserProfileMenu role="HR Executive" variant="pill" />
    </Box>
  </Flex>
</Flex>
  );
};

export default TopBar;
