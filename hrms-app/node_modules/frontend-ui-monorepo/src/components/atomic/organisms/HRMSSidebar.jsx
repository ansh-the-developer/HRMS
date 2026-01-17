import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  IconButton,
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
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Logo from "./../atoms/Logo";

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

  const SIDEBAR_BG = "#307DC717";
  const SIDEBAR_BORDER = "#307DC730";
  const bgActive = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  const sidebarWidth = isCollapsed ? "80px" : "260px";

  return (
    <Box
      as="aside"
      position="fixed"
      top={0}
      left={0}
      h="100vh"
      w={sidebarWidth}
      bg={SIDEBAR_BG}
      borderRightWidth="1px"
      borderRightColor={SIDEBAR_BORDER}
      px={isCollapsed ? 3 : 6}
      py={8}
      overflowY="auto"
      zIndex={1000}
    >
      {/* Logo + collapse toggle */}
      <Box
        mb={10}
        display="flex"
        flexDirection={isCollapsed ? "column" : "row"}
        alignItems="center"
        justifyContent={isCollapsed ? "center" : "space-between"}
        gap={isCollapsed ? 3 : 0}
      >
        <Box
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          justifyContent="center"
          bg="#7152F31A"
          borderRadius="full"
          p={isCollapsed ? 2 : 1}
        >
          <IconButton
            aria-label="Toggle sidebar"
            icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            size="xs"
            variant="ghost"
            color="#7152F3"
            _hover={{ bg: "transparent" }}
            onClick={onToggleCollapse}
          />
        </Box>

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

      {/* Navigation */}
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
                _hover={{ bg: "#307DC72E" }}
              >
                <Icon as={item.icon} boxSize={5} color={iconColor} />
                {!isCollapsed && (
                  <Text fontSize="md">{item.label}</Text>
                )}
              </Flex>
            </NavLink>
          );
        })}
      </VStack>
    </Box>
  );
};

export default HRMSSidebar;
