import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
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

const HRMSSidebar = () => {
  const location = useLocation();
  const bgActive = useColorModeValue("white", "gray.700");
  const bgSidebar = useColorModeValue("#F5F7FF", "gray.900");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      as="aside"
      w="260px"
      h="100vh"
      bg={bgSidebar}
      borderRightWidth="1px"
      borderColor="gray.200"
      position="fixed"
      left={0}
      top={0}
      px={6}
      py={8}
    >
      {/* Logo */}
      <Box mb={10}>
        <Logo
          w={{ base: "6rem", md: "7rem" }}
          h="auto"
          alt="Company sidebar logo"
        />
      </Box>

      {/* Nav items */}
      <VStack align="stretch" spacing={3}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path}>
              <Flex
                align="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="xl"
                bg={isActive ? bgActive : "transparent"}
                color={isActive ? "purple.600" : "gray.700"}
                fontWeight={isActive ? "semibold" : "medium"}
                _hover={{ bg: bgActive }}
              >
                <Icon as={item.icon} boxSize={5} color={iconColor} />
                <Text fontSize="md">{item.label}</Text>
              </Flex>
            </NavLink>
          );
        })}
      </VStack>
    </Box>
  );
};

export default HRMSSidebar;
