import React, { useState } from "react";
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
import { FiSun, FiMoon, FiSearch, FiBell, FiCheck, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // ✅ replaces useAuth0
import { LogoutButton } from "@/components/atomic/molecules/LogoutButton";
import SidebarToggleButton from "@/components/atomic/atoms/SidebarToggleButton";
import UserProfileMenu from "../organisms/UserProfileMenu";
import { designTokens } from "@/theme/designTokens";

const TopBar = ({ onOpenSidebarMobile }) => {
  const { user } = useAuth(); // ✅ replaces useAuth0()
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

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

  // ✅ Supabase user display name fallback chain
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";

  const headerBg = useColorModeValue("rgba(255, 255, 255, 0.70)", "rgba(26, 32, 44, 0.70)");
  const borderColor = "border-color";

  return (
    <Flex
      as="header"
      align="center"
      px={{ base: 4, md: 8 }}
      h="72px"
      bg="transparent"
      position="sticky"
      top={0}
      zIndex={10}
      pt={2}
    >
      <Flex align="center" gap={3} minW={0} position="relative">
        <SidebarToggleButton onClick={onOpenSidebarMobile} />

        {/* Floating Mist Greeting Container */}
        <Box
          position="relative"
          px={4}
          py={1.5}
          borderRadius="2xl"
          bgGradient={useColorModeValue(
            "radial(ellipse at center, rgba(255, 255, 255, 0.55) 0%, rgba(232, 237, 245, 0) 85%)",
            "radial(ellipse at center, rgba(99, 102, 241, 0.18) 0%, rgba(8, 13, 26, 0) 85%)"
          )}
          backdropFilter="blur(16px)"
          filter="drop-shadow(0 4px 12px rgba(0,0,0,0.06))"
        >
          <VStack align="start" spacing={0} minW={0}>
            <Heading
              size="md"
              noOfLines={1}
              fontWeight="bold"
              color="text-primary"
              textShadow={useColorModeValue(
                "0 2px 10px rgba(15, 23, 42, 0.08)",
                "0 2px 14px rgba(0, 0, 0, 0.40)"
              )}
            >
              Hello, {displayName} 👋
            </Heading>
            <Text
              fontSize="xs"
              fontWeight="medium"
              color="text-secondary"
              letterSpacing="wide"
            >
              Good Morning 🌸
            </Text>
          </VStack>
        </Box>
      </Flex>

      {/* Right side of TopBar - Independent Floating Glass Objects */}
      <Flex ml="auto" align="center" gap={3} flexShrink={0}>
        {/* Search Bar with ⌘ K Keyboard Shortcut Badge */}
        <InputGroup display={{ base: "none", lg: "flex" }} w="320px">
          <InputLeftElement pointerEvents="none" color="text-muted">
            <FiSearch size={16} />
          </InputLeftElement>
          <Input
            placeholder="Search employees, documents..."
            size="sm"
            borderRadius="xl"
            bg="card-bg"
            border="1px solid"
            borderColor="border-color"
            _focus={{ borderColor: "accent", boxShadow: "0 0 0 1px #6366F1" }}
            boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
          />
          <InputRightElement w="60px" h="42px">
            <Kbd fontSize="10px" borderRadius="md" px={1.5} py={0.5} bg="app-bg-secondary" color="text-muted">
              ⌘ K
            </Kbd>
          </InputRightElement>
        </InputGroup>

        {/* Functional Notification Bell with Interactive Dropdown Menu */}
        <Menu placement="bottom-end" closeOnSelect={false}>
          <Box position="relative">
            <MenuButton
              as={IconButton}
              aria-label="Notifications"
              icon={<FiBell size={18} />}
              variant="ghost"
              borderRadius="14px"
              w="42px"
              h="42px"
              bg="card-bg"
              backdropFilter={`blur(${designTokens.glassBlur})`}
              border="1px solid"
              borderColor="border-color"
              boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
              color="text-secondary"
              _hover={{ bg: "hover-bg", color: "text-primary", transform: "translateY(-1px)" }}
              transition="all 0.2s ease"
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
                boxShadow="0 2px 8px rgba(239, 68, 68, 0.4)"
                pointerEvents="none"
              >
                {unreadCount}
              </Badge>
            )}
          </Box>
          <MenuList
            w={{ base: "300px", sm: "360px" }}
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
                <Button
                  size="xs"
                  variant="ghost"
                  color="accent"
                  fontSize="11px"
                  onClick={markAllAsRead}
                >
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

        {/* Sleek Floating Theme Switcher Glass Button */}
        <IconButton
          aria-label="Toggle Color Mode"
          icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="ghost"
          borderRadius="14px"
          fontSize="lg"
          w="42px"
          h="42px"
          bg="glass-bg"
          backdropFilter={`blur(${designTokens.glassBlur})`}
          border="1px solid"
          borderColor="border-color"
          boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
          color="text-secondary"
          _hover={{ bg: "hover-bg", color: "text-primary", transform: "translateY(-1px)" }}
          transition="all 0.2s ease"
        />

        {/* Mobile: simple avatar icon */}
        <Box display={{ base: "block", md: "none" }}>
          <UserProfileMenu role="HR Executive" variant="icon" />
        </Box>

        {/* Desktop: full pill in independent floating glass card */}
        <Box
          display={{ base: "none", md: "block" }}
          bg="glass-bg"
          backdropFilter={`blur(${designTokens.glassBlur})`}
          border="1px solid"
          borderColor="border-color"
          borderRadius="16px"
          boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
        >
          <UserProfileMenu role="HR Executive" variant="pill" />
        </Box>
      </Flex>
    </Flex>
  );
};

export default TopBar;