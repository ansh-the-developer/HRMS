import {
  Box,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  Text,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import HRMSSidebar from "@/components/atomic/organisms/HRMSSidebar";
import TopBar from "@/components/atomic/organisms/TopBar";
import SakuraGlassEffect from "@/components/ui/SakuraGlassEffect";
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout";
import { useAuth } from "@/hooks/useAuth";
import { designTokens } from "@/theme/designTokens";

const SIDEBAR_EXPANDED = 270;
const SIDEBAR_COLLAPSED = 80;

const DashboardLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse
  const { isLocked, unlockSession } = useInactivityTimeout(true);
  const { signOut } = useAuth();
  const toast = useToast();
  const [authInput, setAuthInput] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!authInput.trim()) return;

    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setAuthInput("");
      unlockSession();
      toast({
        title: "Session Unlocked",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }, 400);
  };

  return (
    <>
      {/* Session Autolock Re-Authentication Modal */}
      <Modal isOpen={isLocked} onClose={() => {}} isCentered closeOnOverlayClick={false} closeOnEsc={false}>
        <ModalOverlay backdropFilter="blur(24px)" bg="rgba(8, 12, 24, 0.85)" />
        <ModalContent
          bg="card-bg"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="border-color"
          borderRadius="24px"
          shadow="2xl"
          mx={4}
        >
          <form onSubmit={handleUnlock}>
            <ModalHeader textAlign="center" pt={6} pb={1}>
              <Text fontSize="2xl">🔒</Text>
              <Text fontSize="lg" fontWeight="bold" color="text-primary" mt={1}>
                Session Locked
              </Text>
              <Text fontSize="xs" color="text-muted" fontWeight="normal" mt={1}>
                You were inactive for 5 minutes. Enter your password or TOTP to unlock.
              </Text>
            </ModalHeader>

            <ModalBody py={4}>
              <VStack spacing={3}>
                <Input
                  type="password"
                  placeholder="Password or TOTP code"
                  value={authInput}
                  onChange={(e) => setAuthInput(e.target.value)}
                  autoFocus
                  borderRadius="xl"
                  bg="app-bg-secondary"
                  borderColor="border-color"
                  _focus={{ borderColor: "accent" }}
                />
              </VStack>
            </ModalBody>

            <ModalFooter gap={3} pb={6}>
              <Button
                variant="ghost"
                size="sm"
                colorScheme="red"
                borderRadius="xl"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
              <Button
                type="submit"
                size="sm"
                bg="accent"
                color="white"
                borderRadius="xl"
                px={6}
                isLoading={isUnlocking}
                _hover={{ bg: "accent-hover" }}
              >
                Unlock Session
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Premium Background Layer (Japanese Spring & Winter Ambient Halos) */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-2}
        bg="app-bg"
        overflow="hidden"
        pointerEvents="none"
      >
        {designTokens.enableBackgroundOverlay && (
          <>
            {/* Boosted 25% Ambient Presence Halos */}
            <Box
              position="absolute"
              top="-25%"
              left="-15%"
              w="65%"
              h="70%"
              bgGradient={useColorModeValue(
                "radial(circle, rgba(251, 207, 232, 0.48) 0%, rgba(228, 235, 245, 0) 75%)",
                "radial(circle, rgba(99, 102, 241, 0.22) 0%, rgba(30, 41, 59, 0) 75%)"
              )}
              filter="blur(120px)"
            />
            <Box
              position="absolute"
              bottom="-20%"
              right="-15%"
              w="70%"
              h="75%"
              bgGradient={useColorModeValue(
                "radial(circle, rgba(186, 230, 253, 0.70) 0%, rgba(228, 235, 245, 0) 75%)",
                "radial(circle, rgba(56, 189, 248, 0.14) 0%, rgba(15, 23, 42, 0) 75%)"
              )}
              filter="blur(130px)"
            />
            <Box
              position="absolute"
              top="35%"
              left="25%"
              w="50%"
              h="55%"
              bgGradient={useColorModeValue(
                "radial(circle, rgba(244, 114, 182, 0.22) 0%, rgba(228, 235, 245, 0) 75%)",
                "radial(circle, rgba(139, 92, 246, 0.12) 0%, rgba(15, 23, 42, 0) 75%)"
              )}
              filter="blur(140px)"
            />
          </>
        )}
      </Box>

      {/* Falling Sakura Petals Canvas */}
      <SakuraGlassEffect />

      {/* Desktop sidebar (fixed) */}
      <Box
        as="aside"
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w={`${sidebarWidth + 32}px`}
        display={{ base: "none", md: "block" }}
        transition="width 0.2s ease"
        zIndex={1000}
      >
        <HRMSSidebar
          isCollapsed={isCollapsed}
          onItemClick={onClose}
          onToggleCollapse={() => setIsCollapsed((p) => !p)}
        />
      </Box>

      {/* Mobile sidebar drawer */}
      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="270px">
          <HRMSSidebar onItemClick={onClose} isCollapsed={false} />
        </DrawerContent>
      </Drawer>

      {/* Main content area */}
      <Box
        ml={{ base: 0, md: `${sidebarWidth + 32}px` }}
        minH="100vh"
        transition="margin-left 0.2s ease"
      >
        <TopBar
          onOpenSidebarMobile={onOpen}
          onToggleSidebarDesktop={() => setIsCollapsed((p) => !p)}
          isCollapsed={isCollapsed}
        />

        {/* Scroll container with Apple-style page transition animation */}
        <Box
          as="main"
          px={{ base: 3, sm: 4, md: 6, lg: 8 }}
          py={{ base: 4, md: 6 }}
          minH="calc(100vh - 72px)"
          overflowY="auto"
          css={{
            animation: "pageFadeUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            "@keyframes pageFadeUp": {
              "0%": { opacity: 0, transform: "translateY(10px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default DashboardLayout;
