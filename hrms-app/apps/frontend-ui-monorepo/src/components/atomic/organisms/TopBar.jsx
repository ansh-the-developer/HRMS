// src/components/atomic/organisms/TopBar.jsx
import { Flex, VStack, Heading, Text, Box } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "@/components/atomic/molecules/LogoutButton";
import SidebarToggleButton from "@/components/atomic/atoms/SidebarToggleButton";
import { IconButton } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const TopBar = ({ onOpenSidebarMobile, onToggleSidebarDesktop, isCollapsed }) => {
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
      <Flex align="center" gap={3}>
        {/* Mobile hamburger */}
        <SidebarToggleButton onClick={onOpenSidebarMobile} />


        <VStack align="start" spacing={0}>
          <Heading size="md">Hello {user?.name || user?.email}</Heading>
          <Text fontSize="sm" color="gray.500">
            Good Morning
          </Text>
        </VStack>
      </Flex>

      <Box>
        <LogoutButton />
      </Box>
    </Flex>
  );
};

export default TopBar;
