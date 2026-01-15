import { Button, HStack, Icon, Circle } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

const HRMSButton = ({
  withPlusIcon = false,
  variant = "solid",
  size = "sm",
  children,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      borderRadius="10px"
      bgGradient="linear(to-r, #307DC7, #C1B9B8)"
      color="white"
      _hover={{
        bgGradient: "linear(to-r, #276BAA, #AAA09E)",
        opacity: 0.95,
      }}
      _active={{
        bgGradient: "linear(to-r, #225886, #8E8483)",
      }}
      {...props}
    >
      <HStack spacing={2}>
        {withPlusIcon && (
          <Circle size="20px" bg="white" color="#307DC7">
            <Icon as={FiPlus} boxSize={3} />
          </Circle>
        )}
        <span>{children}</span>
      </HStack>
    </Button>
  );
};

export default HRMSButton;
