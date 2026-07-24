import { Button, Icon, Circle, useColorModeValue } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

const HRMSButton = ({
  withPlusIcon = false,
  variant = "solid",
  size = "sm",
  children,
  onClick,
  ...props
}) => {
  const isOutline = variant === "outline";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  // Map variants to exact design system tokens
  let buttonStyles = {
    bg: "accent",
    color: "white",
    _hover: {
      bg: "accent-hover",
      transform: "translateY(-2px)",
      boxShadow: "0 10px 30px rgba(99, 102, 241, 0.25)",
    }
  };

  if (isSecondary) {
    buttonStyles = {
      bg: "app-bg-secondary",
      backdropFilter: "blur(16px)",
      border: "1px solid",
      borderColor: "border-color",
      color: "text-primary",
      _hover: {
        bg: "hover-bg",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      }
    };
  } else if (isOutline) {
    buttonStyles = {
      bg: "glass-bg",
      backdropFilter: "blur(16px)",
      border: "1px solid",
      borderColor: "border-color",
      color: "text-primary",
      _hover: {
        bg: "hover-bg",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      }
    };
  } else if (isGhost) {
    buttonStyles = {
      bg: "transparent",
      color: "text-secondary",
      _hover: {
        bg: "hover-bg",
        color: "text-primary",
        transform: "translateY(-1px)",
      }
    };
  } else if (isDanger) {
    buttonStyles = {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "red.400",
      _hover: {
        bg: "rgba(239, 68, 68, 0.22)",
        transform: "translateY(-2px)",
      }
    };
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={onClick}
      pointerEvents="auto"
      zIndex={1}
      h="42px"
      borderRadius="12px"
      fontWeight="600"
      lineHeight="1.2"
      _active={{
        transform: "scale(0.98)",
      }}
      transition="all 150ms cubic-bezier(0.4, 0, 0.2, 1)"
      {...buttonStyles}
      {...props}
    >
      {withPlusIcon && (
        <Circle 
          size="20px" 
          bg={variant === "solid" ? "white" : "brand.500"} 
          color={variant === "solid" ? "brand.500" : "white"} 
          mr={2} 
          display="inline-flex" 
          alignItems="center"
        >
          <Icon as={FiPlus} boxSize={3} />
        </Circle>
      )}
      {children}
    </Button>
  );
};

export default HRMSButton;
