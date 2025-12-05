import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiClock,
  FiClipboard,
  FiTrendingUp,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import Logo from "./../atoms/Logo";
import { IconButton } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const navItems = [
  { label: "Home", icon: FiHome, path: "/home" },
  { label: "Employee", icon: FiUsers, path: "/employees" },
  { label: "Attendance", icon: FiClock, path: "/attendance" },
  { label: "Leaves", icon: FiClipboard, path: "/leaves" },
  { label: "Performance", icon: FiTrendingUp, path: "/performance" },
  { label: "Payroll", icon: FiDollarSign, path: "/payroll" },
  { label: "Settings", icon: FiSettings, path: "/settings" },
];

const HRMSSidebar = ({
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  
  // New color constants
  const SIDEBAR_BG = "#307DC717";
  const SIDEBAR_BORDER = "#307DC730";
  const bgActive = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      as="aside"
      w="100%"
      h="100vh"
      bg={SIDEBAR_BG}
      borderTopRightRadius={isCollapsed ? "none" : "24px"}
      borderBottomRightRadius={isCollapsed ? "none" : "24px"}
      borderRightWidth={isCollapsed ? "0" : "1px"}
      borderRightColor={SIDEBAR_BORDER}
      px={isCollapsed ? 3 : 6}
      py={8}
    >
      {/* Logo */}
      <Box
        mb={10}
        display="flex"
        flexDirection={isCollapsed ? "column" : "row"}
        alignItems="center"
        justifyContent={isCollapsed ? "center" : "space-between"}
        gap={isCollapsed ? 3 : 0}
      >
        {/* Toggle button – shown on md+ only */}
        <Box
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          justifyContent="center"
          bg="#7152F31A"
          borderRadius="full"
          p={isCollapsed ? 2 : 1}
        >
          {!isCollapsed ? (
            <IconButton
              aria-label="Collapse sidebar"
              icon={<FiChevronLeft />}
              size="xs"
              variant="ghost"
              color="#7152F3"
              _hover={{ bg: "transparent" }}
              onClick={onToggleCollapse}
            />
          ) : (
            <IconButton
              aria-label="Expand sidebar"
              icon={<FiChevronRight />}
              size="xs"
              variant="ghost"
              color="#7152F3"
              _hover={{ bg: "transparent" }}
              onClick={onToggleCollapse}
            />
          )}
        </Box>

        {/* Logo */}
        <Logo
          w={
            isCollapsed
              ? { base: "2.5rem", md: "3rem" }
              : { base: "7rem", md: "8rem" }
          }
          h="auto"
          alt="Company sidebar logo"
        />
      </Box>
      
      {/* Nav items */}
      <VStack align="stretch" spacing={3}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path} onClick={onItemClick}>
              <Flex
                align="center"
                gap={isCollapsed ? 0 : 3}
                justify={isCollapsed ? "center" : "flex-start"}
                px={isCollapsed ? 0 : 4}
                py={3}
                borderRadius={isCollapsed ? "xl" : "0 12px 12px 0"}
                bg={isActive ? bgActive : "transparent"}
                color={isActive ? "purple.600" : "gray.700"}
                fontWeight={isActive ? "semibold" : "medium"}
                _hover={{ 
                  bg: "#307DC72E" // Slightly darker hover matching theme
                }}
              >
                <Icon as={item.icon} boxSize={5} color={iconColor} />
                {!isCollapsed && <Text fontSize="md">{item.label}</Text>}
              </Flex>
            </NavLink>
          );
        })}
      </VStack>
    </Box>
  );
};

export default HRMSSidebar;
