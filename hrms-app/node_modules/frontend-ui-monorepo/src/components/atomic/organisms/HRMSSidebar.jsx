import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiClock,
  FiClipboard,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiShield,
  FiList,
  FiLogOut,
  FiGlobe,
  FiRefreshCw,
} from "react-icons/fi";
import Logo from "./../atoms/Logo";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";

const HRMSSidebar = ({
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const { role, originalRole, isSwitched, isLoading } = useRole();
  const { user, signOut } = useAuth();

  const SIDEBAR_BG = "#307DC717";
  const SIDEBAR_BORDER = "#307DC730";
  const bgActive = useColorModeValue("white", "gray.700");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  const sidebarWidth = isCollapsed ? "80px" : "260px";

  // Build items list according to active perspective
  const navItemsList = [];
  if (role === "employee") {
    navItemsList.push(
      { label: "Home", icon: FiHome, path: "/home" },
      { label: "Schedule", icon: FiClock, path: "/attendance" },
      { label: "Leave/Vacation", icon: FiClipboard, path: "/leaves" },
      { label: "Salary", icon: FiDollarSign, path: "/payroll" },
      { label: "Complaint Center", icon: FiShield, path: "/complaints" },
      { label: "Profile", icon: FiUser, path: `/employees/${user?.id || ""}`, exact: true }
    );
  } else {
    navItemsList.push(
      { label: "Home", icon: FiHome, path: "/home" },
      { label: "Employee Mgmt.", icon: FiUsers, path: "/employees" },
      { label: "Schedule Mgmt.", icon: FiClock, path: "/attendance" },
      { label: "Leave Request Data", icon: FiClipboard, path: "/leaves/requests" },
      { label: "Salary Mgmt.", icon: FiDollarSign, path: "/payroll" },
      { label: "Complaint Center", icon: FiShield, path: "/complaints" },
      { label: "Employee ID & Docs", icon: FiClipboard, path: "/employees/documents" },
      { label: "Activity Logs", icon: FiList, path: "/activity-logs" }
    );
  }

  const isItemActive = (itemPath, exact = false) => {
    if (exact) {
      return location.pathname === itemPath;
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  const handleSignOutClick = async (e) => {
    e.preventDefault();
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleToggleView = () => {
    if (isSwitched) {
      localStorage.removeItem("hrms_switched_view");
    } else {
      localStorage.setItem("hrms_switched_view", "employee");
    }
    // Redirect to home and reload to reset router states cleanly
    window.location.href = "/home";
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
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      zIndex={1000}
    >
      {/* Top Part: Logo, Toggle Button, List */}
      <Box
        display="flex"
        flexDirection="column"
        flex="1"
        overflowY="auto"
        pr={1}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "#CBD5E1", borderRadius: "4px" },
        }}
      >
        {/* Header Logo Row */}
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

        {/* Menu Items Loop */}
        <VStack align="stretch" spacing={2.5}>
          {!isLoading &&
            navItemsList.map((item) => {
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

          {/* Sign Out Action Item */}
          <Flex
            align="center"
            gap={isCollapsed ? 0 : 3}
            justify={isCollapsed ? "center" : "flex-start"}
            px={isCollapsed ? 0 : 4}
            py={3}
            borderRadius={isCollapsed ? "xl" : "0 12px 12px 0"}
            color="gray.700"
            fontWeight="medium"
            cursor="pointer"
            _hover={{ bg: "#307DC72E" }}
            onClick={handleSignOutClick}
          >
            <Icon as={FiLogOut} boxSize={5} color={iconColor} />
            {!isCollapsed && <Text fontSize="md">Sign out</Text>}
          </Flex>
        </VStack>
      </Box>

      {/* Bottom Part: Switch Perspective Card & Language Selection */}
      <Box mt="auto" pt={4} borderTopWidth="1px" borderColor={SIDEBAR_BORDER}>
        {/* Switch View button */}
        {(originalRole === "hr" || originalRole === "manager") && (
          <Box mb={isCollapsed ? 0 : 4}>
            {isCollapsed ? (
              <IconButton
                aria-label="Switch Perspective"
                icon={<FiRefreshCw />}
                size="md"
                bg="#7152F3"
                color="white"
                _hover={{ bg: "#5F33E1" }}
                onClick={handleToggleView}
                borderRadius="xl"
                w="full"
              />
            ) : (
              <Button
                size="sm"
                w="full"
                bg="#7152F3"
                color="white"
                borderRadius="xl"
                py={4.5}
                fontSize="xs"
                fontWeight="bold"
                leftIcon={<FiRefreshCw />}
                _hover={{ bg: "#5F33E1" }}
                onClick={handleToggleView}
                shadow="sm"
              >
                {isSwitched ? "Switch to Admin UI" : "Switch to Employee UI"}
              </Button>
            )}
          </Box>
        )}

        {/* Language selector (only in Admin / HR mode) */}
        {!isCollapsed && role !== "employee" && (
          <Flex align="center" justify="space-between" mt={2} pt={2}>
            <HStack spacing={2} color="gray.500">
              <FiGlobe size={16} />
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="wide" color="#94A3B8">LANGUAGE</Text>
            </HStack>
            <Menu placement="top-end">
              <MenuButton
                as={Button}
                size="xs"
                variant="ghost"
                rightIcon={<Text fontSize="9px">▼</Text>}
                fontSize="xs"
                fontWeight="bold"
                color="#475569"
                px={1}
                _hover={{ bg: "gray.100" }}
              >
                English
              </MenuButton>
              <MenuList fontSize="xs" minW="120px">
                <MenuItem fontWeight="medium">English</MenuItem>
                <MenuItem fontWeight="medium">हिन्दी (Hindi)</MenuItem>
                <MenuItem fontWeight="medium">नेपाली (Nepali)</MenuItem>
                <MenuItem fontWeight="medium">한국어 (Korean)</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default HRMSSidebar;