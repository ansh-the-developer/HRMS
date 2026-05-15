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
  FiUser,
} from "react-icons/fi";
import Logo from "./../atoms/Logo";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";

const baseNavItems = [
  {
    label: "Home",
    icon: FiHome,
    path: "/home",
    roles: ["hr", "manager", "employee"],
  },
  {
    label: "Employee",
    icon: FiUsers,
    path: "/employees",
    roles: ["hr", "manager"],
  },
  {
    label: "Attendance",
    icon: FiClock,
    path: "/attendance",
    roles: ["hr", "manager", "employee"],
  },
  {
    label: "Leaves",
    icon: FiClipboard,
    path: "/leaves",
    roles: ["hr", "manager", "employee"],
  },
  {
    label: "Performance",
    icon: FiTrendingUp,
    path: "/performance",
    roles: ["hr", "manager", "employee"],
  },
  {
    label: "Payroll",
    icon: FiDollarSign,
    path: "/payroll",
    roles: ["hr", "employee"],
  },
  {
    label: "Settings",
    icon: FiSettings,
    path: "/settings",
    roles: ["hr"],
  },
];

const HRMSSidebar = ({
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const { role, isLoading } = useRole();
  const { user } = useAuth();

  const SIDEBAR_BG = "#307DC717";
  const SIDEBAR_BORDER = "#307DC730";
  const bgActive = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  const sidebarWidth = isCollapsed ? "80px" : "260px";

  const navItems = [
    ...baseNavItems,
    ...(role === "employee" && user?.id
      ? [
          {
            label: "My Profile",
            icon: FiUser,
            path: `/employees/${user.id}`,
            roles: ["employee"],
            exact: true,
          },
        ]
      : []),
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(role));

  const isItemActive = (itemPath, exact = false) => {
    if (exact) {
      return location.pathname === itemPath;
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

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

      <VStack align="stretch" spacing={3}>
        {!isLoading &&
          visibleNavItems.map((item) => {
            const isActive = isItemActive(item.path, item.exact);

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
                  <Icon as={item.icon} boxSize={5} color={isActive ? "purple.600" : iconColor} />
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