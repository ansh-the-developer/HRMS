// src/components/atomic/atoms/HRMSInput.jsx
import { Input } from "@chakra-ui/react";

const HRMSInput = ({
  h = "56px",
  borderRadius = "10px",
  ...props
}) => {
  return (
    <Input
      h={h}
      borderRadius={borderRadius}
      fontSize="sm"
      bg="white"
      borderColor="gray.200"
      _hover={{
        borderColor: "gray.300",
      }}
      _focus={{
        borderColor: "purple.500",
        boxShadow: "none",
      }}
      {...props}
    />
  );
};

export default HRMSInput;
