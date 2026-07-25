import React, { useState } from "react";
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
import HelpCenterModal from "./HelpCenterModal";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { designTokens } from "@/theme/designTokens";

const LANG_LABELS = {
  en: "English",
  hi: "हिन्दी",
  ne: "नेपाली",
  ko: "한국어",
};

const HRMSSidebar = ({
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const { role, originalRole, isSwitched, isLoading } = useRole();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);

  // Elevate all useColorModeValue calls to top-level to satisfy Rules of Hooks
  const sidebarBg = useColorModeValue(designTokens.sidebarGradientLight, designTokens.sidebarGradientDark);
  const sidebarBorderColor = useColorModeValue("rgba(255, 255, 255, 0.80)", "rgba(255, 255, 255, 0.16)");
  const sidebarBoxShadow = useColorModeValue(designTokens.sidebarShadowLight, designTokens.sidebarShadowDark);

  const topGlowBg = useColorModeValue(
    "radial(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
    "radial(circle, rgba(129, 140, 248, 0.22) 0%, transparent 75%)"
  );
  const centerGlowBg = useColorModeValue(
    "radial(circle, rgba(186, 230, 253, 0.20) 0%, transparent 70%)",
    "radial(circle, rgba(56, 189, 248, 0.15) 0%, transparent 75%)"
  );

  const activeItemBg = useColorModeValue("rgba(99, 102, 241, 0.16)", "rgba(99, 102, 241, 0.32)");
  const activeItemBorder = useColorModeValue("1px solid rgba(99, 102, 241, 0.30)", "1px solid rgba(255, 255, 255, 0.30)");
  const activeItemShadow = useColorModeValue(
    "0 4px 18px rgba(99, 102, 241, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.80)",
    "0 4px 20px rgba(99, 102, 241, 0.40), inset 0 1px 0 0 rgba(255, 255, 255, 0.40)"
  );
  const activeItemHoverBg = useColorModeValue("rgba(99, 102, 241, 0.22)", "rgba(99, 102, 241, 0.40)");

  const sidebarWidth = isCollapsed ? "80px" : "270px";

  const isEmployee = role === "employee";

  const adminNavItems = [
    { label: t("dashboard"), path: "/home", icon: FiHome },
    { label: t("employeeManagement"), path: "/employees", icon: FiUsers },
    { label: t("attendance"), path: "/attendance", icon: FiClock },
    { label: t("leaveManagement"), path: "/leaves", icon: FiClipboard },
    { label: t("payroll"), path: "/payroll", icon: FiDollarSign },
    { label: t("complaints"), path: "/complaints", icon: FiShield },
    { label: t("settings"), path: "/settings", icon: FiUser },
    { label: t("activityLogs"), path: "/activity-logs", icon: FiList },
  ];

  const employeeNavItems = [
    { label: t("dashboard"), path: "/home", icon: FiHome },
    { label: t("attendance"), path: "/attendance", icon: FiClock },
    { label: t("leaveManagement"), path: "/leaves", icon: FiClipboard },
    { label: t("payroll"), path: "/payroll", icon: FiDollarSign },
    { label: t("complaints"), path: "/complaints", icon: FiShield },
    { label: t("settings"), path: "/settings", icon: FiUser },
  ];

  const navItems = isEmployee ? employeeNavItems : adminNavItems;

  const isItemActive = (itemPath, exact = false) => {
    if (exact) {
      return location.pathname === itemPath;
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  const handleSignOutClick = async (e) => {
    e.preventDefault();
    localStorage.removeItem("userRole");
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleToggleView = () => {
    if (isSwitched) {
      localStorage.setItem("userRole", originalRole);
    } else {
      localStorage.setItem("userRole", "employee");
    }
    window.location.reload();
  };

  return (
    <>
      <Box
        h="full"
        w="full"
        bg={sidebarBg}
        backdropFilter={`blur(${designTokens.glassBlurSidebar})`}
        borderRight="1px solid"
        borderColor={sidebarBorderColor}
        boxShadow={sidebarBoxShadow}
        px={isCollapsed ? 3 : 4}
        py={5}
        display="flex"
        flexDirection="column"
        position="relative"
        overflow="hidden"
        css={{ backdropFilter: "blur(18px)" }}
      >
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          w="80%"
          h="160px"
          bgGradient={topGlowBg}
          filter="blur(24px)"
          pointerEvents="none"
          borderRadius="24px"
        />

        <Box
          position="absolute"
          top="40%"
          left="5%"
          w="90%"
          h="180px"
          bgGradient={centerGlowBg}
          filter="blur(28px)"
          pointerEvents="none"
          borderRadius="24px"
        />

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
          <Box
            position="relative"
            mb={6}
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
                  : { base: "1.75rem", md: "2rem" }
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
                onClick={onToggleCollapse}
                _hover={{ bg: "transparent" }}
              />
            </Box>
          </Box>

          <VStack spacing={1.5} align="stretch" w="full">
            {!isLoading &&
              navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onItemClick}
                    style={{ textDecoration: "none" }}
                  >
                    <Flex
                      align="center"
                      gap={isCollapsed ? 0 : 3.5}
                      justify={isCollapsed ? "center" : "flex-start"}
                      px={isCollapsed ? 0 : 4}
                      py={2.5}
                      borderRadius="16px"
                      bg={isActive ? activeItemBg : "transparent"}
                      color={isActive ? "text-primary" : "text-secondary"}
                      fontWeight={isActive ? "semibold" : "medium"}
                      _hover={
                        isActive
                          ? { bg: activeItemHoverBg }
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
          </VStack>
        </Box>

        <Box mt="auto" pt={3} borderTopWidth="1px" borderColor="border-color">
          <Flex
            align="center"
            gap={isCollapsed ? 0 : 3}
            justify={isCollapsed ? "center" : "flex-start"}
            px={isCollapsed ? 0 : 4}
            py={2.5}
            mb={2}
            borderRadius="14px"
            color="text-secondary"
            fontWeight="medium"
            cursor="pointer"
            _hover={{ bg: "rgba(239, 68, 68, 0.15)", color: "red.400" }}
            transition="all 0.18s ease"
            onClick={handleSignOutClick}
          >
            <Icon as={FiLogOut} boxSize={4.5} color="red.400" />
            {!isCollapsed && <Text fontSize="sm" fontWeight="semibold" color="red.400">{t("signOut")}</Text>}
          </Flex>

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
              onClick={() => setIsHelpCenterOpen(true)}
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
                    {t("needHelp")}
                  </Text>
                  <Text fontSize="10px" color="text-muted">
                    {t("contactSupport")}
                  </Text>
                </VStack>
              </HStack>
              <FiChevronRight size={14} color="gray" />
            </Flex>
          )}

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
                  {isSwitched ? t("switchAdminUI") : t("switchEmployeeUI")}
                </Button>
              )}
            </Box>
          )}

          {!isCollapsed && (
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
                <Text fontSize="10px" fontWeight="bold" letterSpacing="wider" color="text-muted">{t("language")}</Text>
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
                  {LANG_LABELS[language] || "English"}
                </MenuButton>
                <MenuList fontSize="xs" minW="120px" zIndex={20}>
                  <MenuItem fontWeight="medium" onClick={() => setLanguage("en")}>English</MenuItem>
                  <MenuItem fontWeight="medium" onClick={() => setLanguage("hi")}>हिन्दी (Hindi)</MenuItem>
                  <MenuItem fontWeight="medium" onClick={() => setLanguage("ne")}>नेपाली (Nepali)</MenuItem>
                  <MenuItem fontWeight="medium" onClick={() => setLanguage("ko")}>한국어 (Korean)</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Box>
      </Box>

      <HelpCenterModal
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
      />
    </>
  );
};

export default HRMSSidebar;