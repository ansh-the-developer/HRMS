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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const UserProfileMenu = ({ role = "HR Executive", variant = "pill" }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "User";

  const avatarUrl = user?.user_metadata?.avatar_url || undefined;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  if (!user) return null;

  const isIcon = variant === "icon";

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={isIcon ? IconButton : Box}
        aria-label="User menu"
        // shared
        cursor="pointer"
        bg="card-bg"
        _hover={{ boxShadow: "md" }}
        // icon-only style
        icon={
          isIcon ? (
            <Avatar
              src={avatarUrl}
              name={displayName}
              borderRadius="md"
              boxSize="30px"
            />
          ) : undefined
        }
        // pill style
        borderRadius={isIcon ? "full" : "lg"}
        borderWidth={isIcon ? 0 : 1}
        borderColor="border-color"
        px={isIcon ? 0 : 2}
        py={isIcon ? 0 : 1}
        display="inline-flex"
        alignItems="center"
        boxShadow={isIcon ? "none" : "sm"}
        minW="auto"
      >
        {!isIcon && (
          <Flex align="center" gap={2} maxW="220px">
            <Avatar
              src={avatarUrl}
              name={displayName}
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
                {displayName}
              </Text>
              <Text
                fontSize="xs"
                color="text-muted"
                lineHeight="short"
                noOfLines={1}
              >
                {role}
              </Text>
            </Box>
            <Icon
              as={FiChevronDown}
              boxSize={4}
              color="text-muted"
              ml="auto"
              flexShrink={0}
            />
          </Flex>
        )}
      </MenuButton>

      <MenuList bg="card-bg" borderColor="border-color" minW="40" borderRadius="lg" py={1}>
        <MenuItem
          icon={<FiLogOut />}
          fontSize="sm"
          py={2}
          color="red.500"
          _hover={{ bg: "hover-bg" }}
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserProfileMenu;
