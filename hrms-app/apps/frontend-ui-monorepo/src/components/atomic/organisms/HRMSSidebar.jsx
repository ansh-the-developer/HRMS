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
  FiHeadphones,
} from "react-icons/fi";
import Logo from "./../atoms/Logo";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { designTokens } from "@/theme/designTokens";

const HRMSSidebar = ({
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const { role, originalRole, isSwitched, isLoading } = useRole();
  const { user, signOut } = useAuth();

  // All colors now driven by semantic theme tokens (card-bg, border-color, hover-bg, text-muted, accent)

  const sidebarWidth = isCollapsed ? "80px" : "270px";

  // Build items list according to active perspective
  const navItemsList = [];
  if (role === "employee") {
    navItemsList.push(
      { label: "Home", icon: FiHome, path: "/home" },
      { label: "Attendance", icon: FiClock, path: "/attendance" },
      { label: "Leave/Vacation", icon: FiClipboard, path: "/leaves" },
      { label: "Salary", icon: FiDollarSign, path: "/payroll" },
      { label: "Complaint Center", icon: FiShield, path: "/complaints" },
      { label: "Profile", icon: FiUser, path: `/employees/${user?.id || ""}`, exact: true }
    );
  } else {
    navItemsList.push(
      { label: "Home", icon: FiHome, path: "/home" },
      { label: "Employee Mgmt.", icon: FiUsers, path: "/employees" },
      { label: "Attendance", icon: FiClock, path: "/attendance" },
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
      top="16px"
      left="16px"
      h="calc(100vh - 32px)"
      w={sidebarWidth}
      bg={useColorModeValue(designTokens.sidebarGradientLight, designTokens.sidebarGradientDark)}
      backdropFilter={`blur(${designTokens.glassBlurSidebar})`}
      border="1px solid"
      borderColor={useColorModeValue("rgba(255, 255, 255, 0.80)", "rgba(255, 255, 255, 0.16)")}
      borderRadius="24px"
      boxShadow={useColorModeValue(designTokens.sidebarShadowLight, designTokens.sidebarShadowDark)}
      px={isCollapsed ? 3 : 5}
      py={7}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      zIndex={1000}
      transition="width 0.2s ease, transform 0.2s ease"
    >
      {/* Internal Ambient Lighting Layer 1: Top Indigo Glow */}
      <Box
        position="absolute"
        top="-10px"
        left="10%"
        w="80%"
        h="140px"
        bgGradient={useColorModeValue(
          "radial(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
          "radial(circle, rgba(129, 140, 248, 0.22) 0%, transparent 75%)"
        )}
        filter="blur(24px)"
        pointerEvents="none"
        borderRadius="24px"
      />

      {/* Internal Ambient Lighting Layer 2: Center Ice Blue Glow */}
      <Box
        position="absolute"
        top="40%"
        left="5%"
        w="90%"
        h="180px"
        bgGradient={useColorModeValue(
          "radial(circle, rgba(186, 230, 253, 0.20) 0%, transparent 70%)",
          "radial(circle, rgba(56, 189, 248, 0.15) 0%, transparent 75%)"
        )}
        filter="blur(28px)"
        pointerEvents="none"
        borderRadius="24px"
      />

      {/* Top Part: Logo, Toggle Button, List */}
      <Box
        display="flex"
        flexDirection="column"
        flex="1"
        overflowY="auto"
        pr={1}
        position="relative"
        zIndex={1}
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(148, 163, 184, 0.3)", borderRadius: "4px" },
        }}
      >
        {/* Header Logo Row */}
        <Box
          position="relative"
          mb={8}
          display="flex"
          flexDirection={isCollapsed ? "column" : "row"}
          alignItems="center"
          justifyContent={isCollapsed ? "center" : "space-between"}
          gap={isCollapsed ? 3 : 0}
        >
          <Logo
            w={
              isCollapsed
                ? { base: "1.25rem", md: "1.5rem" }
                : { base: "3.5rem", md: "4rem" }
            }
            h="auto"
            alt="Company sidebar logo"
          />

          <Box
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            justifyContent="center"
            bg="app-bg-secondary"
            backdropFilter="blur(12px)"
            border="1px solid"
            borderColor="border-color"
            borderRadius="full"
            p={isCollapsed ? 2 : 1}
          >
            <IconButton
              aria-label="Toggle sidebar"
              icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              size="xs"
              variant="ghost"
              color="accent"
              _hover={{ bg: "transparent" }}
              onClick={onToggleCollapse}
            />
          </Box>
        </Box>

        {/* Menu Items Loop */}
        <VStack align="stretch" spacing={2}>
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
                    py={2.5}
                    borderRadius="14px"
                    bg={
                      isActive
                        ? useColorModeValue("rgba(99, 102, 241, 0.16)", "rgba(99, 102, 241, 0.32)")
                        : "transparent"
                    }
                    backdropFilter={isActive ? "blur(16px)" : "none"}
                    color={isActive ? "text-primary" : "text-secondary"}
                    fontWeight={isActive ? "bold" : "medium"}
                    border={
                      isActive
                        ? useColorModeValue("1px solid rgba(99, 102, 241, 0.30)", "1px solid rgba(255, 255, 255, 0.30)")
                        : "1px solid transparent"
                    }
                    boxShadow={
                      isActive
                        ? useColorModeValue(
                            "0 4px 18px rgba(99, 102, 241, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.80)",
                            "0 4px 20px rgba(99, 102, 241, 0.40), inset 0 1px 0 0 rgba(255, 255, 255, 0.40)"
                          )
                        : "none"
                    }
                    _hover={
                      isActive
                        ? { bg: useColorModeValue("rgba(99, 102, 241, 0.22)", "rgba(99, 102, 241, 0.40)") }
                        : { bg: "hover-bg", color: "text-primary", transform: "translateY(-1px)" }
                    }
                    transition="all 0.18s ease"
                  >
                    <Icon
                      as={item.icon}
                      boxSize={4.5}
                      color={isActive ? "accent" : "text-muted"}
                    />
                    {!isCollapsed && <Text fontSize="sm">{item.label}</Text>}
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
            py={2.5}
            borderRadius="14px"
            color="text-secondary"
            fontWeight="medium"
            cursor="pointer"
            _hover={{ bg: "rgba(239, 68, 68, 0.12)", color: "red.400" }}
            transition="all 0.18s ease"
            onClick={handleSignOutClick}
          >
            <Icon as={FiLogOut} boxSize={4.5} color="text-muted" />
            {!isCollapsed && <Text fontSize="sm">Sign out</Text>}
          </Flex>
        </VStack>
      </Box>

      {/* Bottom Part: Switch Perspective Card, Need Help Card & Language Selection */}
      <Box mt="auto" pt={3} borderTopWidth="1px" borderColor="border-color">
        {/* Need Help? Contact Support Glass Card */}
        {!isCollapsed && (
          <Flex
            align="center"
            justify="space-between"
            bg="card-bg"
            backdropFilter="blur(16px)"
            border="1px solid"
            borderColor="border-color"
            borderRadius="16px"
            p={3}
            mb={3}
            cursor="pointer"
            _hover={{ bg: "hover-bg", transform: "translateY(-1px)" }}
            transition="all 0.18s ease"
          >
            <HStack spacing={3}>
              <Box
                p={2}
                borderRadius="12px"
                bg="rgba(99, 102, 241, 0.15)"
                color="accent"
              >
                <FiHeadphones size={16} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold" color="text-primary">
                  Need Help?
                </Text>
                <Text fontSize="10px" color="text-muted">
                  Contact Support
                </Text>
              </VStack>
            </HStack>
            <FiChevronRight size={14} color="gray" />
          </Flex>
        )}

        {/* Switch View button */}
        {(originalRole === "hr" || originalRole === "manager") && (
          <Box mb={isCollapsed ? 0 : 3}>
            {isCollapsed ? (
              <IconButton
                aria-label="Switch Perspective"
                icon={<FiRefreshCw />}
                size="md"
                bg="accent"
                color="white"
                _hover={{ bg: "accent-hover" }}
                onClick={handleToggleView}
                borderRadius="14px"
                w="full"
              />
            ) : (
              <Button
                size="sm"
                w="full"
                bg="accent"
                color="white"
                borderRadius="14px"
                py={4.5}
                fontSize="xs"
                fontWeight="bold"
                leftIcon={<FiRefreshCw />}
                _hover={{ bg: "accent-hover", transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(99, 102, 241, 0.30)" }}
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
          <Flex
            align="center"
            justify="space-between"
            bg="app-bg-secondary"
            border="1px solid"
            borderColor="border-color"
            borderRadius="14px"
            p={2}
            px={3}
          >
            <HStack spacing={2} color="text-muted">
              <FiGlobe size={14} />
              <Text fontSize="10px" fontWeight="bold" letterSpacing="wider" color="text-muted">LANGUAGE</Text>
            </HStack>
            <Menu placement="top-end">
              <MenuButton
                as={Button}
                size="xs"
                variant="ghost"
                rightIcon={<Text fontSize="9px">▼</Text>}
                fontSize="xs"
                fontWeight="bold"
                color="text-secondary"
                px={1}
                _hover={{ bg: "hover-bg" }}
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