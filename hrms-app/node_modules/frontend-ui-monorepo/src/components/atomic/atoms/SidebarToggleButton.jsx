import { IconButton } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

const SidebarToggleButton = ({ onClick }) => (
  <IconButton
    aria-label="Open sidebar"
    icon={<FiMenu />}
    variant="ghost"
    size="md"
    display={{ base: "inline-flex", md: "none" }}  // show only on mobile
    onClick={onClick}
  />
);

export default SidebarToggleButton;
