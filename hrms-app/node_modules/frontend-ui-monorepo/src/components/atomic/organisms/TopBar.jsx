import {
  Flex,
  VStack,
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
} from "@chakra-ui/react";
import { FiSun, FiMoon, FiSearch, FiBell } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth"; // ✅ replaces useAuth0
import { LogoutButton } from "@/components/atomic/molecules/LogoutButton";
import SidebarToggleButton from "@/components/atomic/atoms/SidebarToggleButton";
import UserProfileMenu from "../organisms/UserProfileMenu";
import { designTokens } from "@/theme/designTokens";

const TopBar = ({ onOpenSidebarMobile }) => {
  const { user } = useAuth(); // ✅ replaces useAuth0()
  const { colorMode, toggleColorMode } = useColorMode();

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
            h="42px"
            borderRadius="16px"
            bg="glass-bg"
            backdropFilter={`blur(${designTokens.glassBlur})`}
            border="1px solid"
            borderColor="border-color"
            fontSize="xs"
            color="text-primary"
            _placeholder={{ color: "text-muted" }}
            boxShadow={useColorModeValue(designTokens.glassShadowLight, designTokens.glassShadowDark)}
          />
          <InputRightElement w="60px" h="42px">
            <Kbd fontSize="10px" borderRadius="md" px={1.5} py={0.5} bg="app-bg-secondary" color="text-muted">
              ⌘ K
            </Kbd>
          </InputRightElement>
        </InputGroup>

        {/* Notification Bell Button with Count Badge */}
        <Box position="relative">
          <IconButton
            aria-label="Notifications"
            icon={<FiBell size={18} />}
            variant="ghost"
            borderRadius="14px"
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
          >
            3
          </Badge>
        </Box>

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