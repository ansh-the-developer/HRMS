import React, { useState, useEffect } from "react";
import {
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Box,
  useColorModeValue,
  useColorMode,
  IconButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Input,
  Kbd,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { FiSun, FiMoon, FiSearch, FiBell, FiInfo } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SidebarToggleButton from "@/components/atomic/atoms/SidebarToggleButton";
import UserProfileMenu from "../organisms/UserProfileMenu";
import GlobalSearch from "../organisms/GlobalSearch";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { designTokens } from "@/theme/designTokens";

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/employees")) return "Employee Management";
  if (pathname.startsWith("/attendance")) return "Attendance Dashboard";
  if (pathname.startsWith("/leaves")) return "Leave Management";
  if (pathname.startsWith("/payroll")) return "Salary & Payroll";
  if (pathname.startsWith("/complaints")) return "Complaint Center";
  if (pathname.startsWith("/settings")) return "System Settings";
  if (pathname.startsWith("/activity-logs")) return "Activity Logs";
  return "HRMS Dashboard";
};

const TopBar = ({ onOpenSidebarMobile }) => {
  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: empRecord } = useEmployeeProfile(user?.id, user?.email);

  // Global Search state & hotkey listener
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Notification state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Leave Request Approved",
      message: "Your Casual Leave for Jul 9 – Jul 10, 2026 has been approved.",
      time: "10 mins ago",
      read: false,
      link: "/leaves",
    },
    {
      id: 2,
      title: "Attendance Recorded",
      message: "Today's check-in was logged at 09:15 AM.",
      time: "2 hours ago",
      read: false,
      link: "/attendance",
    },
    {
      id: 3,
      title: "New Policy Announcement",
      message: "Office closed on July 20 for holiday.",
      time: "1 day ago",
      read: false,
      link: "/home",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  // Name formatting
  const rawEmailName = user?.email ? user.email.split("@")[0] : "Admin";
  const formattedEmailName = rawEmailName.charAt(0).toUpperCase() + rawEmailName.slice(1);
  const displayName =
    empRecord?.nickname ||
    empRecord?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    formattedEmailName;

  const isHomePage = location.pathname === "/home";
  const pageTitle = getPageTitle(location.pathname);

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 3, sm: 4, md: 6, lg: 8 }}
        py={2.5}
        minH="72px"
        w="full"
        bg="transparent"
        position="sticky"
        top={0}
        zIndex={10}
        gap={{ base: 2, md: 3, lg: 4 }}
        wrap="nowrap"
      >
        {/* Left: Sidebar Toggle + Title Container */}
        <HStack
          spacing={3}
          align="center"
          minW={0}
          flexShrink={1}
          flexGrow={0}
          maxW={{ base: "45%", sm: "40%", md: "38%", lg: "42%" }}
        >
          <SidebarToggleButton onClick={onOpenSidebarMobile} />

          <Box
            position="relative"
            px={3}
            py={1}
            borderRadius="2xl"
            minW={0}
            overflow="hidden"
            bgGradient={useColorModeValue(
              "radial(ellipse at center, rgba(255, 255, 255, 0.55) 0%, rgba(232, 237, 245, 0) 85%)",
              "radial(ellipse at center, rgba(99, 102, 241, 0.18) 0%, rgba(8, 13, 26, 0) 85%)"
            )}
            backdropFilter="blur(16px)"
          >
            <VStack align="start" spacing={0} minW={0}>
              <Heading
                size="sm"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                fontWeight="bold"
                color="text-primary"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                noOfLines={1}
                maxW="full"
              >
                {isHomePage ? `Hello, ${displayName} 👋` : pageTitle}
              </Heading>
              <Text
                fontSize="xs"
                fontWeight="medium"
                color="text-muted"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                display={{ base: "none", lg: "block" }}
              >
                {isHomePage ? "Good Morning 🌸" : "HappyHRMS Enterprise Workspace"}
              </Text>
            </VStack>
          </Box>
        </HStack>

        {/* Center: Fully Fluid Search Bar (Shrinks smoothly without forcing title wrap) */}
        <Box
          flex="1"
          minW={{ base: "100px", sm: "140px", md: "180px" }}
          maxW={{ base: "full", md: "340px", lg: "480px" }}
          mx={{ base: 1, md: 2 }}
          onClick={() => setIsGlobalSearchOpen(true)}
          cursor="pointer"
        >
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none" color="text-muted" h="full">
              <FiSearch size={15} />
            </InputLeftElement>
            <Input
              readOnly
              placeholder="Search employees, attendance, leaves..."
              size="sm"
              borderRadius="xl"
              bg="card-bg"
              border="1px solid"
              borderColor="border-color"
              _hover={{ borderColor: "accent" }}
              boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
              fontSize="xs"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            />
            <InputRightElement w="48px" h="full" display={{ base: "none", sm: "flex" }}>
              <Kbd fontSize="9px" borderRadius="md" px={1.5} py={0.5} bg="app-bg-secondary" color="text-muted">
                ⌘ K
              </Kbd>
            </InputRightElement>
          </InputGroup>
        </Box>

        {/* Right: Actions / Profile Menu (flex-shrink: 0, stays pinned) */}
        <HStack spacing={{ base: 1.5, sm: 2, md: 3 }} align="center" flexShrink={0}>
          {/* Notification Bell */}
          <Menu placement="bottom-end" closeOnSelect={false}>
            <Box position="relative">
              <MenuButton
                as={IconButton}
                aria-label="Notifications"
                icon={<FiBell size={17} />}
                variant="ghost"
                borderRadius="14px"
                w="38px"
                h="38px"
                bg="card-bg"
                border="1px solid"
                borderColor="border-color"
                boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
                color="text-secondary"
                _hover={{ bg: "hover-bg", color: "text-primary", transform: "translateY(-1px)" }}
              />
              {unreadCount > 0 && (
                <Badge
                  position="absolute"
                  top="-2px"
                  right="-2px"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="9px"
                  px={1.5}
                  py={0.2}
                  pointerEvents="none"
                >
                  {unreadCount}
                </Badge>
              )}
            </Box>
            <MenuList
              w={{ base: "280px", sm: "340px" }}
              maxH="420px"
              overflowY="auto"
              bg="card-bg"
              borderColor="border-color"
              borderRadius="20px"
              p={2}
              boxShadow="0 20px 40px rgba(0,0,0,0.15)"
              zIndex={20}
            >
              <Flex align="center" justify="space-between" px={3} py={2}>
                <HStack spacing={2}>
                  <Text fontSize="sm" fontWeight="bold" color="text-primary">
                    Notifications
                  </Text>
                  {unreadCount > 0 && (
                    <Badge colorScheme="indigo" borderRadius="full" px={2} fontSize="10px">
                      {unreadCount} new
                    </Badge>
                  )}
                </HStack>
                {unreadCount > 0 && (
                  <Button size="xs" variant="ghost" color="accent" fontSize="11px" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </Flex>
              <MenuDivider borderColor="border-color" my={1} />
              {notifications.length === 0 ? (
                <VStack py={6} spacing={2} justify="center">
                  <FiInfo size={24} color="gray" />
                  <Text fontSize="xs" color="text-muted">
                    No notifications yet
                  </Text>
                </VStack>
              ) : (
                notifications.map((n) => (
                  <MenuItem
                    key={n.id}
                    borderRadius="xl"
                    p={3}
                    mb={1}
                    bg={n.read ? "transparent" : "rgba(99, 102, 241, 0.06)"}
                    _hover={{ bg: "hover-bg" }}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <HStack align="start" spacing={3} w="full">
                      <Box
                        w="8px"
                        h="8px"
                        mt={1.5}
                        borderRadius="full"
                        bg={n.read ? "transparent" : "accent"}
                        flexShrink={0}
                      />
                      <VStack align="start" spacing={0.5} flex={1}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" fontWeight="bold" color="text-primary">
                            {n.title}
                          </Text>
                          <Text fontSize="9px" color="text-muted">
                            {n.time}
                          </Text>
                        </HStack>
                        <Text fontSize="11px" color="text-secondary" noOfLines={2}>
                          {n.message}
                        </Text>
                      </VStack>
                    </HStack>
                  </MenuItem>
                ))
              )}
            </MenuList>
          </Menu>

          {/* Theme Toggle Button */}
          <IconButton
            aria-label="Toggle Color Mode"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            borderRadius="14px"
            fontSize="md"
            w="38px"
            h="38px"
            bg="glass-bg"
            border="1px solid"
            borderColor="border-color"
            boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
            color="text-secondary"
            _hover={{ bg: "hover-bg", color: "text-primary", transform: "translateY(-1px)" }}
          />

          {/* User Profile Menu */}
          <Box display={{ base: "none", sm: "block" }}>
            <UserProfileMenu role="HR Executive" variant="pill" />
          </Box>
          <Box display={{ base: "block", sm: "none" }}>
            <UserProfileMenu role="HR Executive" variant="icon" />
          </Box>
        </HStack>
      </Flex>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
      />
    </>
  );
};

export default TopBar;