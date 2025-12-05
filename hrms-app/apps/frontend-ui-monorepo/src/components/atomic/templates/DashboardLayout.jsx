// src/components/atomic/templates/DashboardLayout.jsx
import {
  Box,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import HRMSSidebar from "@/components/atomic/organisms/HRMSSidebar";
import TopBar from "@/components/atomic/organisms/TopBar";
import { useState } from "react";

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

const DashboardLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <Flex>
      {/* Desktop sidebar (collapsible) */}
      <Box
        as="aside"
        display={{ base: "none", md: "block" }}
        w={`${sidebarWidth}px`}
        transition="width 0.2s ease"
      >
        <HRMSSidebar
          isCollapsed={isCollapsed}
          onItemClick={onClose}
          onToggleCollapse={() => setIsCollapsed((p) => !p)}
        />{" "}
      </Box>

      {/* Mobile sidebar drawer */}
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="260px">
          <HRMSSidebar onItemClick={onClose} isCollapsed={false} />
        </DrawerContent>
      </Drawer>

      {/* Right side */}
      <Box
        ml={{ base: 0, md: 0 }} // no shift on md+
        w="100%"
        minH="100vh"
        bg="white"
        transition="margin-left 0.2s ease"
      >
        <TopBar
          onOpenSidebarMobile={onOpen}
          onToggleSidebarDesktop={() => setIsCollapsed((p) => !p)}
          isCollapsed={isCollapsed}
        />
        <Box as="main" px={{ base: 4, md: 8 }} py={6}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
