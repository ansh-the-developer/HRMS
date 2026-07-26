// src/components/atomic/organisms/HRMSSidebar.jsx
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
import { useRole, clearPerspective } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { designTokens } from "@/theme/designTokens";

const LANG_LABELS = {
  en: "English",
  hi: "हिन्दी",
  ne: "नेपाली",
  ko: "한국어",
};

const HRMSSidebar = ({ onItemClick, isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const { role, originalRole, isSwitched, isLoading, toggleView } = useRole();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);

  const sidebarBg = useColorModeValue(
    designTokens.sidebarGradientLight,
    designTokens.sidebarGradientDark
  );
  const sidebarBorderColor = useColorModeValue(
    "rgba(255, 255, 255, 0.80)",
    "rgba(255, 255, 255, 0.16)"
  );
  const sidebarBoxShadow = useColorModeValue(
    designTokens.sidebarShadowLight,
    designTokens.sidebarShadowDark
  );

  const topGlowBg = useColorModeValue(
    "radial(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)",
    "radial(circle, rgba(129, 140, 248, 0.22) 0%, transparent 75%)"
  );
  const centerGlowBg = useColorModeValue(
    "radial(circle, rgba(186, 230, 253, 0.20) 0%, transparent 70%)",
    "radial(circle, rgba(56, 189, 248, 0.15) 0%, transparent 75%)"
  );

  const activeItemBg = useColorModeValue(
    "rgba(99, 102, 241, 0.16)",
    "rgba(99, 102, 241, 0.32)"
  );
  const activeItemBorder = useColorModeValue(
    "1px solid rgba(99, 102, 241, 0.30)",
    "1px solid rgba(255, 255, 255, 0.30)"
  );
  const activeItemShadow = useColorModeValue(
    "0 4px 18px rgba(99, 102, 241, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.80)",
    "0 4px 20px rgba(99, 102, 241, 0.40), inset 0 1px 0 0 rgba(255, 255, 255, 0.40)"
  );
  const activeItemHoverBg = useColorModeValue(
    "rgba(99, 102, 241, 0.22)",
    "rgba(99, 102, 241, 0.40)"
  );

  const sidebarWidth = isCollapsed ? "80px" : "270px";

  const isEmployee = role === "employee";

  // Profile route reuses the existing /employees/:id route, which is
  // already RoleRoute-allowed for hr, manager, and employee, and resolves
  // to the logged-in user's own profile inside EmployeeProfilePage.
  const profilePath = `/employees/${user?.id ?? ""}`;

  const adminNavItems = [
    { label: t("dashboard"), path: "/home", icon: FiHome },
    { label: t("employeeManagement"), path: "/employees", icon: FiUsers },
    { label: t("attendance"), path: "/attendance", icon: FiClock },
    { label: t("leaveManagement"), path: "/leaves", icon: FiClipboard },
    { label: t("payroll"), path: "/payroll", icon: FiDollarSign },
    { label: t("complaints"), path: "/complaints", icon: FiShield },
    { label: t("profile"), path: profilePath, icon: FiUser },
    { label: t("settings"), path: "/settings", icon: FiUser },
    { label: t("activityLogs"), path: "/activity-logs", icon: FiList },
  ];

  const employeeNavItems = [
    { label: t("dashboard"), path: "/home", icon: FiHome },
    { label: t("attendance"), path: "/attendance", icon: FiClock },
    { label: t("leaveManagement"), path: "/leaves", icon: FiClipboard },
    { label: t("payroll"), path: "/payroll", icon: FiDollarSign },
    { label: t("complaints"), path: "/complaints", icon: FiShield },
    { label: t("profile"), path: profilePath, icon: FiUser },
  ];

  const navItems = isEmployee ? employeeNavItems : adminNavItems;

  const isItemActive = (itemPath, exact = false) => {
    if (exact) {
      return location.pathname === itemPath;
    }
    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  const handleSignOutClick = async (e) => {
    e.preventDefault();
    clearPerspective();
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleToggleView = () => {
    toggleView();
  };

  return (
    <>
      <Box
        as="nav"
        w={sidebarWidth}
        h="100vh"
        bg={sidebarBg}
        borderRight={`1px solid ${sidebarBorderColor}`}
        boxShadow={sidebarBoxShadow}
        position="relative"
        overflow="hidden"
        transition="width 0.2s ease"
        display="flex"
        flexDirection="column"
      >
        <Box
          position="absolute"
          top="-10%"
          left="-10%"
          w="60%"
          h="40%"
          bgGradient={topGlowBg}
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="30%"
          left="20%"
          w="80%"
          h="60%"
          bgGradient={centerGlowBg}
          pointerEvents="none"
        />

        <Flex
          align="center"
          justify={isCollapsed ? "center" : "space-between"}
          px={4}
          py={5}
          zIndex={1}
        >
          <Logo collapsed={isCollapsed} />
          <IconButton
            aria-label="Toggle sidebar"
            icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            size="xs"
            variant="ghost"
            color="accent"
            onClick={onToggleCollapse}
            _hover={{ bg: "transparent" }}
          />
        </Flex>

        <VStack align="stretch" spacing={1} px={3} flex="1" zIndex={1} overflowY="auto">
          {!isLoading &&
            navItems.map((item) => {
              const isActive = isItemActive(item.path);
              return (
                <Box
                  as={NavLink}
                  key={item.label}
                  to={item.path}
                  onClick={onItemClick}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={3}
                  py={2.5}
                  borderRadius="12px"
                  bg={isActive ? activeItemBg : "transparent"}
                  border={isActive ? activeItemBorder : "1px solid transparent"}
                  boxShadow={isActive ? activeItemShadow : "none"}
                  _hover={{ bg: isActive ? activeItemHoverBg : "rgba(0,0,0,0.04)" }}
                  transition="all 0.15s ease"
                >
                  <Icon as={item.icon} boxSize={5} color={isActive ? "accent" : "text-secondary"} />
                  {!isCollapsed && (
                    <Text fontSize="sm" fontWeight={isActive ? "semibold" : "medium"}>
                      {item.label}
                    </Text>
                  )}
                </Box>
              );
            })}
        </VStack>

        <VStack align="stretch" spacing={3} px={3} pb={5} zIndex={1}>
          <Box
            as="button"
            display="flex"
            alignItems="center"
            gap={3}
            px={3}
            py={2.5}
            borderRadius="12px"
            _hover={{ bg: "rgba(220, 38, 38, 0.08)" }}
            onClick={handleSignOutClick}
          >
            <Icon as={FiLogOut} boxSize={5} color="red.500" />
            {!isCollapsed && (
              <Text fontSize="sm" fontWeight="medium" color="red.500">
                {t("signOut")}
              </Text>
            )}
          </Box>

          {!isCollapsed && (
            <Box
              as="button"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap={1}
              px={3}
              py={2.5}
              borderRadius="12px"
              _hover={{ bg: "rgba(0,0,0,0.04)" }}
              onClick={() => setIsHelpCenterOpen(true)}
            >
              <HStack>
                <Icon as={FiHeadphones} boxSize={4} color="text-secondary" />
                <Text fontSize="xs" fontWeight="semibold">
                  {t("needHelp")}
                </Text>
              </HStack>
              <Text fontSize="xs" color="text-secondary">
                {t("contactSupport")}
              </Text>
            </Box>
          )}

          {(originalRole === "hr" || originalRole === "manager") && (
            <Box>
              {isCollapsed ? (
                <IconButton
                  aria-label="Switch perspective"
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
                  leftIcon={<FiRefreshCw />}
                  bg="accent"
                  color="white"
                  w="full"
                  borderRadius="14px"
                  _hover={{
                    bg: "accent-hover",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.30)",
                  }}
                  onClick={handleToggleView}
                  shadow="sm"
                >
                  {isSwitched ? t("switchAdminUI") : t("switchEmployeeUI")}
                </Button>
              )}
            </Box>
          )}

          {!isCollapsed && (
            <Menu>
              <HStack justify="space-between" px={1}>
                <Text fontSize="xs" fontWeight="semibold" color="text-secondary">
                  {t("language")}
                </Text>
                <MenuButton
                  as={Button}
                  rightIcon={<Text as="span">▼</Text>}
                  leftIcon={<FiGlobe />}
                  size="xs"
                  variant="ghost"
                  fontSize="xs"
                  fontWeight="bold"
                  color="text-secondary"
                  px={1}
                  _hover={{ bg: "hover-bg" }}
                >
                  {LANG_LABELS[language] || "English"}
                </MenuButton>
              </HStack>
              <MenuList>
                <MenuItem onClick={() => setLanguage("en")}>English</MenuItem>
                <MenuItem onClick={() => setLanguage("hi")}>हिन्दी (Hindi)</MenuItem>
                <MenuItem onClick={() => setLanguage("ne")}>नेपाली (Nepali)</MenuItem>
                <MenuItem onClick={() => setLanguage("ko")}>한국어 (Korean)</MenuItem>
              </MenuList>
            </Menu>
          )}
        </VStack>
      </Box>

      <HelpCenterModal
        isOpen={isHelpCenterOpen}
        onClose={() => setIsHelpCenterOpen(false)}
      />
    </>
  );
};

export default HRMSSidebar;