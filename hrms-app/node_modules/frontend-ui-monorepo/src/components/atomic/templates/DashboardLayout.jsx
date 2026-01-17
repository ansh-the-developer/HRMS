// src/components/atomic/templates/DashboardLayout.jsx
import {
  Box,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import HRMSSidebar from "@/components/atomic/organisms/HRMSSidebar";
import TopBar from "@/components/atomic/organisms/TopBar";

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

const DashboardLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <>
      {/* Desktop sidebar (fixed) */}
      <Box
        as="aside"
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w={`${sidebarWidth}px`}
        display={{ base: "none", md: "block" }}
        transition="width 0.2s ease"
        zIndex={1000}
      >
        <HRMSSidebar
          isCollapsed={isCollapsed}
          onItemClick={onClose}
          onToggleCollapse={() => setIsCollapsed((p) => !p)}
        />
      </Box>

      {/* Mobile sidebar drawer */}
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="260px">
          <HRMSSidebar onItemClick={onClose} isCollapsed={false} />
        </DrawerContent>
      </Drawer>

      {/* Main content area */}
      <Box
        ml={{ base: 0, md: `${sidebarWidth}px` }}
        minH="100vh"
        transition="margin-left 0.2s ease"
      >
        <TopBar
          onOpenSidebarMobile={onOpen}
          onToggleSidebarDesktop={() => setIsCollapsed((p) => !p)}
          isCollapsed={isCollapsed}
        />

        {/* Scroll container */}
        <Box
          as="main"
          px={{ base: 4, md: 8 }}
          py={6}
          minH="calc(100vh - 64px)"
          overflowY="auto"
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default DashboardLayout;
