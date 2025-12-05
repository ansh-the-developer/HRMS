// src/components/atomic/organisms/UserProfileMenu.jsx
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";

const UserProfileMenu = ({ role = "HR Executive", variant = "pill" }) => {
  const { user, logout } = useAuth0();
  if (!user) return null;

  const handleLogout = () => logout({ returnTo: window.location.origin });

  const isIcon = variant === "icon";

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={isIcon ? IconButton : Box}
        aria-label="User menu"
        // shared
        cursor="pointer"
        bg="white"
        _hover={{ boxShadow: "md" }}
        // icon-only style
        icon={
          isIcon ? (
            <Avatar
              src={user.picture}
              name={user.name}
              borderRadius="md"
              boxSize="30px"
            />
          ) : undefined
        }
        // pill style
        borderRadius={isIcon ? "full" : "lg"}
        borderWidth={isIcon ? 0 : 1}
        borderColor="gray.200"
        px={isIcon ? 0 : 2}
        py={isIcon ? 0 : 1}
        display="inline-flex"
        alignItems="center"
        boxShadow={isIcon ? "none" : "sm"}
        minW="auto"
      >
        {!isIcon && (
          <Flex align="center" gap={2} maxW="180px">
            <Avatar
              src={user.picture}
              name={user.name}
              borderRadius="md"
              boxSize="32px"
              flexShrink={0}
            />
            <Box mr={1} overflow="hidden">
              <Text
                fontSize="sm"
                fontWeight="semibold"
                lineHeight="short"
                noOfLines={1}
              >
                {user.name}
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                lineHeight="short"
                noOfLines={1}
              >
                {role}
              </Text>
            </Box>
            <Icon
              as={FiChevronDown}
              boxSize={4}
              color="gray.500"
              ml="auto"
              flexShrink={0}
            />
          </Flex>
        )}
      </MenuButton>

      <MenuList minW="40" borderRadius="lg" py={1}>
        <MenuItem
          icon={<FiLogOut />}
          fontSize="sm"
          py={2}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserProfileMenu;
