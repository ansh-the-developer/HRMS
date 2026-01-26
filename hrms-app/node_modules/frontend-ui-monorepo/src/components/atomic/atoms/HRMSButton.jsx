import { Button, Icon, Circle } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

const HRMSButton = ({
  withPlusIcon = false,
  variant = "solid",
  size = "sm",
  children,
  onClick,
  ...props
}) => {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={onClick}
      pointerEvents="auto"
      zIndex={1}
      bgGradient="linear(to-r, #307DC7, #C1B9B8)"
      color="white"
      _hover={{ opacity: 0.95 }}
      fontWeight="500"     // ← ensure readable text weight
      lineHeight="1.2"     // ← fix line height for gradient
      {...props}
    >
      {withPlusIcon && (
        <Circle 
          size="20px" 
          bg="white" 
          color="#307DC7" 
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
